module.exports = {
  dist: {
    options: {
      // cssmin will minify later
      style: 'expanded',
      compass: true,
      require: 'bootstrap-sass'
    },
    files: {
      'src/css/cimentarius.css': 'src/scss/cimentarius.scss'
    }
  }
}
