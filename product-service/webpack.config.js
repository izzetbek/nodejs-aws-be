const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
    entry: slsw.lib.entries,
    output: {
        libraryTarget: 'commonjs',
        filename: '[name].js',
        path: path.join(__dirname, '.webpack'),
    },
    target: 'node',
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^pg-native$/,
        }),
        new Dotenv()
    ],
    // Generate sourcemaps for proper error messages
    devtool: 'source-map',
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    // Run babel on all .js files and skip those in node_modules
    module: {
        rules: [
            {
                test: /\.js$/, // include .js files
                enforce: 'pre', // preload the jshint loader
                exclude: /node_modules/, // exclude any and all files in the node_modules folder
                include: __dirname,
                loader: 'babel-loader',
            },
        ],
    },
};
