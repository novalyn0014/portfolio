const { series, parallel, task, watch, src, dest } = require('gulp');
const config = require('../config');
const utils = require('../utils');
const lint = require('../linters/lint');
const argv = require('yargs').argv;
const smap = (argv.smap == 'false') ? false : true;


// Static SCSS
const compileScss = require('../compilers/compileScss');
task('scssCompileWp', () =>  {
  return compileScss(config.paths.scss.destWp, smap);
});


// Static TS
const compileTs = require('../compilers/compileTs');
task('tsCompileCommonWp', ()=> {
  return compileTs(
    config.paths.ts.sourceAll + config.paths.ts.common.source + config.paths.ts.common.index,
    config.paths.ts.common.destWp + config.paths.ts.common.source,
    smap
  );
});
task('tsCompileTopWp', ()=> {
  return compileTs(
    config.paths.ts.sourceAll + config.paths.ts.top.source + config.paths.ts.top.index,
    config.paths.ts.top.destWp + config.paths.ts.top.source,
    smap
  );
});
task('tsCompileLowerWp', ()=> {
  return compileTs(
    config.paths.ts.sourceAll + config.paths.ts.lower.source + config.paths.ts.lower.index,
    config.paths.ts.lower.destWp + config.paths.ts.lower.source,
    smap
  );
});

// Asset files
const compileAssets = require('../compilers/compileAssets');
task('assetsCompileWp', () => {
  return compileAssets(config.paths.assets.destWp);
});

// Builder Task
const buildWp = series(
  utils.cleanDist,
  lint,
  'scssCompileWp',
  parallel(['tsCompileCommonWp', 'tsCompileTopWp', 'tsCompileLowerWp']),
  'assetsCompileWp'
);

// Watcher task
const watcherWp = () => {
  const browserSyncWp = require('browser-sync').create();
  browserSyncWp.init(config.browserSync.argsApp);

  task('reloadBrowserWp', function(done){
    browserSyncWp.reload();
    done();
  });

  watch(config.paths.scss.source + '**/*.scss', series(['scssCompileWp', 'reloadBrowserWp']));
  watch(config.paths.ts.sourceAll + config.paths.ts.common.source + '**/*.ts', series(['tsCompileCommonWp', 'reloadBrowserWp']));
  watch(config.paths.ts.sourceAll + config.paths.ts.top.source + '**/*.ts', series(['tsCompileTopWp', 'reloadBrowserWp']));
  watch(config.paths.ts.sourceAll + config.paths.ts.lower.source + '**/*.ts', series(['tsCompileLowerWp', 'reloadBrowserWp']));
  watch(config.paths.assets.source + '**/*.*', series(['assetsCompileWp','reloadBrowserWp']));
  watch(config.paths.wp.source + '**/*.php', series(['reloadBrowserWp']));
};

module.exports = {
  buildWp,
  watcherWp
};
