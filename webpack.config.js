const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  // other configurations...
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ]
};
