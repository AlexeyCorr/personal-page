const {src, dest, series} = require('gulp');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const del = require('del');

const DIST_PATH = 'dist';

const css = () => {
  return src(`${DIST_PATH}/styles/{styles,dark}.css`)
    .pipe(
      postcss([
        require('postcss-import'),
        require('postcss-color-hex-alpha'),
        require('autoprefixer')({ grid: 'autoplace' }),
        require('postcss-csso'),
      ]),
    )
    .pipe(dest(`${DIST_PATH}/styles`));
};

const js = () => {
  return src(`${DIST_PATH}/scripts/*.js`)
    .pipe(
      babel({
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                esmodules: true,
              },
            },
          ],
        ],
      }),
    )
    .pipe(terser())
    .pipe(dest(`${DIST_PATH}/scripts`));
};

const clean = () => {
  return del([
    `${DIST_PATH}/styles/**/*`,
    `!${DIST_PATH}/styles/{styles,dark}.css`,
    `${DIST_PATH}/scripts/**/*`,
    `!${DIST_PATH}/scripts/scripts.js`,
  ]);
};

exports.build = series(css, js, clean);
