module.exports = {
    html : {
        expand: true,
        cwd: 'src/html',
        src: '*',
        dest: 'public/'
    },
    scripts : {
        src: 'src/js/.cimentarius.js',
        dest: 'public/js/cimentarius.js'
    }
}