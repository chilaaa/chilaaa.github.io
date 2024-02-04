const path = require('path');

module.exports = {
  entry: './script.js', // Berkas JavaScript entri
  output: {
    path: path.resolve(__dirname, 'dist'), // Direktori output bundle
    filename: 'bundle.js' // Nama berkas bundle
  },
  module: {
    rules: [
      // Aturan untuk memproses berkas JavaScript dengan Babel
      {
        test: /\.js$/, // Berlaku untuk berkas JavaScript
        exclude: /node_modules/, // Abaikan berkas dalam node_modules
        use: {
          loader: 'babel-loader', // Gunakan babel-loader untuk memproses berkas JavaScript
          options: {
            presets: ['@babel/preset-env'] // Gunakan preset @babel/preset-env untuk kompatibilitas lintas browser
          }
        }
      }
    ]
  }
};
