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
    module: {
        rules: [
          {
            test: /\.css$/i, 
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
      },
    devServer: {
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 3000,
      hot: true,
      open: true,
      proxy: [
        {
          context: ["/api"],
          target: process.env.REACT_APP_API_URL,
          changeOrigin: true,
          withCredentials: true,
          secure: false,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        },
      ],
    },
});