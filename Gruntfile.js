module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            build: 'prod'
        },

        uglify: {
            libs: {
               expand: true,
               cwd:    'dev/public/js/libs',
               src:    '**',
               dest:   'prod/public/js/libs'
            },

            autocomplete: {
                files: {
                    'prod/public/js/plugins/autocomplete/jquery.autocomplete.js': 'dev/public/js/plugins/autocomplete/jquery.autocomplete.js'
                }
            }
        },

        'simple-commonjs': {
            options: {
                main: 'dev/public/js/app/app.js'
            },
            all: {
                files: {
                    'prod/public/js/app/app.js': ['dev/public/js/app/*.js']
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'prod/views/vk_ad_posting.html': 'dev/views/vk_ad_posting.html'
                }
            }
        },



        copy: {
            bootstrap: {
                files: [{
                    expand: true,
                    cwd: 'dev/public/css',
                    src: '**/**',
                    dest: 'prod/public/css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-simple-commonjs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', [
        'clean',
        'uglify:libs',
        'uglify:autocomplete',
        'simple-commonjs',
        'htmlmin',
        'copy'
    ]);
};