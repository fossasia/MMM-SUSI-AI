/**
 * Created by betterclever on 7/1/17.
 */

var webpack = require("webpack");
var fs = require("fs");
var path = require("path");

var nodeModules = {};
fs.readdirSync("node_modules")
    .filter(function (x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = "commonjs " + mod;
    });

module.exports = {

    entry: {
        "bundle": "./src/renderer/index.ts",
    },

    output: {
        path: path.resolve(__dirname, "../dist"),
        publicPath: "./",
        filename: "[name].js",
        chunkFilename: "[id].chunk.js",
        libraryTarget: "var",
        library: "SusiService",
    },

    resolve: {
        extensions: [".js", ".ts", ".tsx", ".jsx"],
    },

    module: {
        loaders: [{
            test: /\.tsx?$/,
            loaders: ["awesome-typescript-loader"],
        },
            {
                test: /\.json$/,
                loaders: ["json-loader"],
            }],
    },

};
