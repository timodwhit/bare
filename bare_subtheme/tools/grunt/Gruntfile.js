'use strict';

var paths = require('compass-options').dirs();

module.exports = function (grunt) {

  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },
      sass: {
        files: [paths.sass + '/{,**/}*.scss'],
        tasks: ['parallel:compass'],
        options: {
          livereload: false
        }
      },
      css: {
        files: [paths.css + '/{,**/}*.css']
      },
      images: {
        files: ['images/**'],
        tasks: ['imagemin', 'svgmin', 'grunticon']
      },
      js: {
        files: [
          paths.js + '/{,**/}*.js',
          '!' + paths.js + '/{,**/}*.min.js',
          '!' + paths.js + '/libraries/**'
        ],
        tasks: ['jshint', 'uglify:dev']
      }
    },

    compass: {
      options: {
        config: 'config.rb',
        bundleExec: true
      },
      dev: {
        options: {
          environment: 'development'
        }
      },
      dist: {
        options: {
          environment: 'production',
          imagesDir: paths.img,
          force: true
        }
      }
    },

    scsslint: {
      allFiles: [
        paths.sass + '/{,**/}*.scss',
      ],
      options: {
        bundleExec: true,
        config: '.scss-lint.yml',
        reporterOutput: 'scss-lint-report.xml',
        colorizeOutput: true
      },
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        paths.js + '/{,**/}*.js',
        '!' + paths.js + '/{,**/}*.min.js',
        '!' + paths.js + '/libraries/**',
        '!' + paths.js + '/global-functions.js',
        '!' + paths.js + '/template.js'
      ]
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'images',
          src: ['**/*.png', '**/*.jpg'],
          dest: paths.img
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'images',
          src: '**/*.svg',
          dest: paths.img
        }]
      }
    },

    grunticon: {
      myIcons: {
        files: [{
          expand: true,
          cwd: 'images',
          src: ['**/*.svg'],
          dest: paths.img + '/grunticon'
        }]
      }
    },

    uglify: {
      dev: {
        options: {
          mangle: false,
          compress: true,
          beautify: false
        },
        files: [{
          expand: true,
          cwd: paths.js,
          src: ['**/*.js', '!**/*.min.js', '!libraries/**'],
          dest: paths.js + '/minified',
          ext: '.min.js'
        }]
      },
      dist: {
        options: {
          mangle: {
            except: ['$', 'jQuery', 'Drupal', 'window', 'document', 'undefined']
          },
          compress: true
        },
        files: [{
          expand: true,
          cwd: paths.js,
          src: ['**/*.js', '!**/*.min.js', '!libraries/**'],
          dest: paths.js + '/minified',
          ext: '.min.js'
        }]
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'images',
            src: ['**', '!**/*.svg', '!**/*.png', '!**/*.jpg'],
            dest: paths.img,
            // Copy if file does not exist.
            filter: function (filepath) {
                // NPM load file path module.
                var path = require('path');

                // Construct the destination file path.
                var dest = path.join(
                    grunt.config('copy.main.dest'),
                    path.basename(filepath)
                );

                // Return false if the file exists.
                return !(grunt.file.exists(dest));
            }
          }
        ]
      }
    },
    modernizr: {
      dist: {
        // [REQUIRED] Path to the build you're using for development.
        'devFile' : paths.js + '/libraries/modernizr/dev/modernizr-dev.js',

        // Path to save out the built file.
        'outputFile' : paths.js + '/libraries/modernizr/prod/modernizr-custom.min.js',

        // Based on default settings on http://modernizr.com/download/
        'extra' : {
          'shiv' : true,
          'printshiv' : false,
          'load' : true,
          'mq' : false,
          'cssclasses' : true
        },

        // Based on default settings on http://modernizr.com/download/
        'extensibility' : {
          'addtest' : false,
          'prefixed' : false,
          'teststyles' : false,
          'testprops' : false,
          'testallprops' : false,
          'hasevents' : false,
          'prefixes' : false,
          'domprefixes' : false,
          'cssclassprefix': 'mdzr-'
        },

        // By default, source is uglified before saving
        'uglify' : true,

        // Define any tests you want to implicitly include.
        'tests' : ['flexbox', 'svg'],

        // By default, this task will crawl your project for references to Modernizr tests.
        // Set to false to disable.
        'parseFiles' : true,

        // When parseFiles = true, this task will crawl all *.js, *.css, *.scss and *.sass files,
        // except files that are in node_modules/.
        // You can override this by defining a 'files' array below.
        // 'files' : {
        // 'src': []
        // },

        // This handler will be passed an array of all the test names passed to the Modernizr API, and will run after the API call has returned
        // 'handler': function (tests) {},

        // When parseFiles = true, matchCommunityTests = true will attempt to
        // match user-contributed tests.
        'matchCommunityTests' : true,

        // Have custom Modernizr tests? Add paths to their location here.
        //'customTests' : []
      }
    },
    parallel: {
      assets: {
        grunt: true,
        tasks: ['imagemin', 'svgmin', 'uglify:dist', 'copy:dist', 'modernizr:dist', 'grunticon:myIcons']
      },
      compass: {
        grunt: true,
        tasks: ['scsslint', 'compass:dev']
      }
    }
  });


  grunt.event.on('watch', function(action, filepath) {
    grunt.config([
      'parallel:assets',
      'compass:dist'
    ], filepath);
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-parallel');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('grunt-scss-lint');

  grunt.registerTask('build', [
    'parallel:assets',
    'compass:dist'
  ]);
};
