// tslint:disable:no-import-side-effect
import { series, task } from 'gulp';
import './tasks/clean';
import './tasks/default';
import './tasks/schematic';
import './tasks/universal';

import './tasks/library';
import './tasks/site';

task('build:release', series(
  'clean',
  'build:library',
  'build:release-site'
));

task('build:preview', series(
  'clean',
  'build:simple-site'
));

task('start:dev', series(
  'clean',
  'start:site'
));