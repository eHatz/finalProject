const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  
  entry: "./index.jsx",

  output: {
    filename: "./public/bundle.js",
    "publicPath": "/"
  },

  devtool: 'cheap-source-map',

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      { 
        test: /\.css$/, 
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")      
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin("public/assets/css/webpackStyle.css")
  ],

  resolve: {
    extensions: ['', '.jsx', '.js']
  }

}
