const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point for the React app
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js', // Output file
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve from 'public'
    },
    compress: true, // Enable gzip compression
    port: 3001, // Set a different port to avoid conflicts with backend
    proxy: [
      {
        context: ['api', 'users'], // Define routes to proxy
        target: 'http://localhost:3000', // Backend server on port 3000
        changeOrigin: true,
      },
    ],
    hot: true,  // Enable hot reloading
    historyApiFallback: true, // React Router support
  }
};
