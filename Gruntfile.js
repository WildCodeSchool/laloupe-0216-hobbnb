'use strict';

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var serveStatic = require('serve-static');


module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    hobbnb: {
      dist: 'public'
    },
    watch: {
      options: {
        livereload: 35729
      },
      src: {
        files: [
          '<%= hobbnb.dist %>/*.html',
          '<%= hobbnb.dist %>/css/*',
          '<%= hobbnb.dist %>/fonts',
          '<%= hobbnb.dist %>/js/**/*',
          '<%= hobbnb.dist %>/views/**/*'
        ]
      }
    },
    connect: {
      proxies: [
        {
          context: '/',
          host: 'localhost',
          port: 8000,
          https: false,
          changeOrigin: false
        }
      ],
      options: {
        port: 9000,
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= hobbnb.dist %>'
          ],
          middleware: function (connect) {
            return [
              proxySnippet,
              serveStatic(require('path').resolve('public'))
            ];
          }
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'configureProxies',
      'connect:livereload',
      'watch'
    ]);
  });
};
