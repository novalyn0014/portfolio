require('dotenv').config();
let config = {}

config.paths = {
  dest: './dist/',

  pug: {
    source: 'src/',
    dest: './dist/',
  },

  scss: {
    source: 'src/css/',
    main: 'main.scss',
    destStatic: 'dist/css/',
    destApp: 'www/html/css/',
    destWp: 'www/html/wp-content/themes/'+process.env.WP_THEME_NAME+'/css/',
  },

  ts: {
    sourceAll: 'src/js/',

    common: {
      source: 'common/',
      index:  'index.ts',
      destStatic: 'dist/js/',
      destApp: 'www/html/js/',
      destWp: 'www/html/wp-content/themes/'+process.env.WP_THEME_NAME+'/js/',
    },
    top: {
      source: 'top/',
      index:  'index.ts',
      destStatic: 'dist/js/',
      destApp: 'www/html/js/',
      destWp: 'www/html/wp-content/themes/'+process.env.WP_THEME_NAME+'/js/',
    },
    lower: {
      source: 'lower/',
      index:  'index.ts',
      destStatic: 'dist/js/',
      destApp: 'www/html/js/',
      destWp: 'www/html/wp-content/themes/'+process.env.WP_THEME_NAME+'/js/',
    }
  },

  assets: {
    source: 'public/',
    destStatic: 'dist/public',
    destApp : 'www/html/public',
    destWp: 'www/html/wp-content/themes/'+process.env.WP_THEME_NAME+'/public/',
  },

  app: {
    source: 'www/html/'
  },

  wp: {
    source: 'www/html/wp-content/themes/'+process.env.WP_THEME_NAME+'/',
  }
}

config.browserSync = {
  argsStatic: {
    port: 8000,
    server: {
      baseDir: './dist'
    }
  },
  argsApp: {
    port: 8000,
    proxy: 'localhost:8080/',
    open: true,
  }
}

module.exports = config
