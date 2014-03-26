'use strict';
var path = require('path');
var fs = require('fs');
var _ = require('lodash-node');
var glob = require('glob');

function getJadeData(isDev) {
  function getFilesInPath(pattern, removePrefix) {
    var files = glob.sync(pattern);
    _.each(files, function (file, num) {
      files[num] = file.substring(removePrefix.length);
    });
    return files;
  }

  function getAppSection(name) {
    var appJs = getFilesInPath('www/js/' + name + '/app.js', 'www/');
    var otherJsFiles = getFilesInPath('www/js/' + name + '/**/*.js', 'www/');
    return _.union(appJs, otherJsFiles);
  }

  var styles = _.union([
    'bower_components/ionic/release/css/ionic.css'
  ], getFilesInPath('www/css/*.css', 'www/'));

  var scripts = _.union([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/lodash/dist/lodash.js',
    'bower_components/momentjs/moment.js',
    'bower_components/ionic/release/js/ionic.bundle.js',
    'bower_components/angular-resource/angular-resource.js',
    'bower_components/angular-sanitize/angular-sanitize.js'
  ], getAppSection('constants'), getAppSection('models'), getAppSection('components'), getAppSection('main'));

  // Must be added last!
  scripts.push('cordova.js');

  return {
    stylesheets: styles,
    scripts: scripts,
    isDev: isDev
  };
}

module.exports = function (grunt) {

  grunt.initConfig({
    jade: {
      compile: {
        options: {
          data: function() {
            return getJadeData(true);
          },
          pretty: true
        },
        files: {
          'www/index.html': ['builder/index.jade']
        }
      }
    },
    stylus: {
      compile: {
        options: {
          linenos: true
        },
        files: {
          'www/css/styles.css': [
            'builder/stylus/imports.styl'
          ]
        }
      }
    },
    watch: {
      builder: {
        files: 'builder/**',
        tasks: 'builder'
      }
    },
    'http-server': {
      dev: {
        root: 'www',
        port: 3001,
        host: 'mobile.local.bucketstreams.com',
        cache: -1
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-http-server');

  grunt.registerTask('builder', [
    'stylus:compile',
    'jade:compile'
  ]);

  grunt.registerTask('default', [
    'builder'
  ]);

  grunt.registerTask('server', 'Running http-server and watcher', function() {
    grunt.task.run('watch', 'http-server');
  });
};