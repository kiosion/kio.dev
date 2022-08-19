/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './dist/index.js',
  output: {
    path: path.join(__dirname, 'bundle'),
    filename: 'bundle.js'
  },
  optimization: {
    minimize: false
  }
};
