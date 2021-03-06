const path = require("path");

const ConfigWebpackPlugin = require("config-webpack");
const Dotenv = require("dotenv-webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin("build/qoc.css");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

const env = process.env.NODE_ENV;
const config = require("config");

module.exports = {
    entry: {
        qoc: "./src/qoc.js",
        callback: "./src/callback.js",
        landing: "./src/landing.js"
    },
    output: {
        filename: "build/[name].js"
    },
    devServer: {
        contentBase: "."
    },
    //devtool: "cheap-eval-source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, "src"),
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: extractCSS.extract(["css-loader"])
            },
            {
                test: /\.styl$/,
                use: extractCSS.extract(["css-loader", "stylus-loader"])
            }
        ]
    },
    plugins: [
        extractCSS,
        new ConfigWebpackPlugin()
    ]
};