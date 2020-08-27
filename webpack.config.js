module.exports = {
    module: {      
      loaders: [
        {
          test: /\.vue$/,
          loader: 'vue'
        }, 
        {
          test: /\.s[a|c]ss$/,
          loader: 'style!css!sass'
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          loader: 'url-loader?limit=100000'
        }
      ]
    },    
    vue: {
      loaders: {
        scss: 'style!css!sass'
      }
    }
  };