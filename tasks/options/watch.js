module.exports = {
    release: {
        options: {
            livereload: true
        },
        scripts: {
            files: ['src/js/**/*.js', 'src/js/*.js'],
            tasks: ['concat', 'uglify'],
            options: {
                spawn: false
            }
        },
        scss: {
            files: ['src/scss/*.scss'],
            tasks: ['sass'],
            options: {
                spawn: false
            }
        },
        css: {
            files: ['src/css/*.css'],
            tasks: ['autoprefixer', 'cssmin'],
            options: {
                spawn: false
            }
        },
        images: {
            files: ['src/images/**/*.{png,jpg,gif}', 'src/images/*.{png,jpg,gif}'],
            tasks: ['imagemin'],
            options: {
                spawn: false
            }
        },
        html: {
            files: ['src/html/*.html'],
            tasks: ['copy'],
            options: {
                spawn: false
            }
        }
    },
    dev: {
        options: {
            livereload: true
        },
        scripts: {
            files: ['src/js/**/*.js', 'src/js/*.js'],
            tasks: ['concat', 'copy'],
            options: {
                spawn: false
            }
        },
        scss: {
            files: ['src/scss/*.scss'],
            tasks: ['sass'],
            options: {
                spawn: false
            }
        },
        css: {
            files: ['src/css/*.css'],
            tasks: ['autoprefixer', 'copy'],
            options: {
                spawn: false
            }
        },
        images: {
            files: ['src/images/**/*.{png,jpg,gif}', 'src/images/*.{png,jpg,gif}'],
            tasks: ['imagemin'],
            options: {
                spawn: false
            }
        },
        html: {
            files: ['src/html/*.html'],
            tasks: ['copy'],
            options: {
                spawn: false
            }
        }
    }
}
