const { merge } = require("webpack-merge");
const path = require('path');
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
    },
    devtool: "eval",
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      open: true,
      proxy: [
        {
          context: ["/certificate"],
          target: process.env.REACT_APP_API_URL+"/certificate",
          changeOrigin: true,
        },
      ],
    }
});