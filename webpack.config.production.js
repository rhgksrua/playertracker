// Production

var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/components/index.js',
        event: './src/bg/eventPage.js'
    },
    output: {
        path: './dist',
        filename: '/src/dist/[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            {
                // loader for moment-timezone
                include: /\.json$/,
                loaders: ['json-loader']
            }
        ]
    },
    plugins: [
        // Removes react development code
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            verbose: false 
        }),
        // Remove /dist
        new CleanWebpackPlugin(['dist'], {
            root: __dirname,
            verbose: false,
            dry: false 
        }),
        // Build
        new CopyWebpackPlugin([
            {
                from: 'manifest.json',
                to: 'manifest.json'
            },
            {
                from: 'src/playerId.js',
                to: 'src/playerId.js'
            },
            {
                from: 'src/browser_action/browser_action.html',
                to: 'src/browser_action/browser_action.html',
            },
            {
                from: 'icons',
                to: 'icons',
            }
        ])

    ]
};
