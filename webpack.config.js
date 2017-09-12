const Uglify = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: './src/js/shipwars.js',
    output: {
        path: __dirname + '/public/js',
        filename: 'shipwars.js'
    },
    plugins: [
        new Uglify()
    ]
}