module.exports = {
    html : {
        expand: true,
        cwd: 'src/html',
        src: '*',
        dest: 'public/'
    },
    css: {
        expand: true,
        cwd: 'src/css/prefixed',
        src: '*',
        dest: 'public/admin/skins/default/css/'
    },
    scripts : {
        src: 'src/js/.cimentarius.js',
        dest: 'public/admin/skins/default/js/cimentarius.js'
    }
}
