const fs = require('fs');
const htmlmin = require('html-minifier');

module.exports = (config) => {
  // HTML Minification

  config.addFilter('htmlmin', (value) => {
    return htmlmin.minify(
      value, {
        removeComments: true,
        collapseWhitespace: true
      }
    );
  });

  config.addTransform('htmlmin', (content, outputPath) => {
    if(outputPath && outputPath.endsWith('.html')) {
      const result = htmlmin.minify(
        content, {
          removeComments: true,
          collapseWhitespace: true
        }
      );

      return result;
    }

    return content;
  });

  // BrowserSync config

  config.setBrowserSyncConfig({
    callbacks: {
        ready: function (err, bs) {
            bs.addMiddleware('*', (req, res) => {
                const content_404 = fs.readFileSync('dist/404.html');
                res.writeHead(404, {
                    'Content-Type': 'text/html; charset=UTF-8',
                });
                res.write(content_404);
                res.end();
            });
        },
    },
});

  // Passthrough Copy

  config.addPassthroughCopy('src/images');
  config.addPassthroughCopy('src/styles');
  config.addPassthroughCopy('src/scripts');

  // Config

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data'
    },
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: [
      'md', 'njk'
    ],
  };
};
