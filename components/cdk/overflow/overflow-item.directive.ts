/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectorRef, Directive, ElementRef, Output, EventEmitter } from '@angular/core';
import { distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

import { NzResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';

@Directive({
  selector: '[nzOverflowItem]',
  host: {
    '[style]': 'overflowStyle'
  }
})
export class NzOverflowItemDirective {
  overflowStyle: { [key: string]: string | number | undefined } | undefined = undefined;
  itemWidth$ = this.nzResizeObserver.observe(this.elementRef.nativeElement).pipe(
    map(([item]) => (item.target as HTMLElement).offsetWidth),
    distinctUntilChanged(),
    startWith(undefined),
    tap(width => {
      this.itemWidth = width;
    })
  );
  itemWidth: number | undefined = undefined;
  @Output() readonly overflowItemHidden = new EventEmitter();

  private preDisplayState: boolean | null = null;

  constructor(
    protected nzResizeObserver: NzResizeObserver,
    protected elementRef: ElementRef,
    protected cdr: ChangeDetectorRef
  ) {}

  setItemStyle(display: boolean, order: number): void {
    const mergedHidden = !display;
    this.overflowStyle = {
      opacity: mergedHidden ? 0 : 1,
      height: mergedHidden ? 0 : undefined,
      overflowY: mergedHidden ? 'hidden' : undefined,
      order: order,
      pointerEvents: mergedHidden ? 'none' : undefined,
      position: mergedHidden ? 'absolute' : undefined
    };
    if (this.preDisplayState !== display && !display) {
      this.overflowItemHidden.emit();
    }
    this.preDisplayState = display;
    this.cdr.markForCheck();
  }
}
