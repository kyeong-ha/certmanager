const { merge } = require("webpack-merge");
const path = require('path');
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "./static_volume/"),
        publicPath: "/",
    },
    devtool: "hidden-source-map",
    module: {
        rules: [
          {
            test: /\.css$/i, 
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
          },
        ],
      },
});