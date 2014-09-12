module.exports = {
  dist: {
    options: {
      // cssmin will minify later
      style: 'expanded'
    },
    files: {
      'src/css/cimentarius.css': 'src/scss/cimentarius.scss'
    }
  }
}
