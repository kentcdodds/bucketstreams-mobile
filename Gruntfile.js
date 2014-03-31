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

  function getSection(root, name) {
    var appJs = getFilesInPath(root + name + '/app.js', root);
    var otherJsFiles = getFilesInPath(root + name + '/**/*.js', root);
    return _.union(appJs, otherJsFiles);
  }

  function getBSJSCommon() {
    var root = 'www/';
    var path = 'bower_components/bs-js-common/bs.common.';
    var models = getSection(root, path + 'models');
    var services = getSection(root, path + 'services');
    var filters = getSection(root, path + 'filters');
    var directives = getSection(root, path + 'directives');
    return _.union(['bower_components/bs-js-common/app.js'], models, services, filters, directives);
  }

  function getAppSection(name) {
    return getSection('www/', 'js/' + name);
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
  ], getBSJSCommon(), getAppSection('components'), getAppSection('main'));

  // Must be added last!
  scripts.push('cordova.js');

  return {
    stylesheets: styles,
    scripts: scripts,
    isDev: isDev,
    BASE_URL: 'http://alpha.bucketstreams.com'
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