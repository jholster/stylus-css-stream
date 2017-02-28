var path = require('path')
var _ = require('lodash')
var through = require('through')
var stylus = require('stylus')
var autoprefixer = require('autoprefixer-stylus')

module.exports = function(filepath, opts) {
  config = _.defaults(opts || {}, {
    compress: false,
    paths: []
  })

  var data = ""

  if(filepath !== undefined && path.extname(filepath) !== ".styl") return through()
  else return through(write, end)

  function write(buf) {
    data += buf
  }

  function end() {
    var self = this
    var options = _.clone(config)

    // Injects the path of the current file.
    options.filename = filepath
    options.use = [autoprefixer({ browsers: ['last 2 version', 'ie >= 10'] })]

    stylus.render(data, options, function (err, css) {
      if (err) {
        // add a better error message
        err.message = err.message + ' in file ' + err.filename + ' line no. ' + err.line

        self.emit('error', new Error(err))
      } else {
        self.queue(css)
      }
      self.queue(null)
    })
  }
}
