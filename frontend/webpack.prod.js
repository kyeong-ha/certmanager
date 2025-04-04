const { merge } = require("webpack-merge");
const path = require('path');
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "/web/static_volume/"),
    },
    devtool: "hidden-source-map",
});