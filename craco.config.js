module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find and modify HtmlWebpackPlugin
      const htmlWebpackPlugin = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === 'HtmlWebpackPlugin'
      );
      
      if (htmlWebpackPlugin) {
        // Disable template compilation to avoid localStorage issue
        htmlWebpackPlugin.userOptions.templateContent = false;
      }

      return webpackConfig;
    },
  },
};
