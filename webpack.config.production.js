// Production

var CopyWebpackPlugin = require('copy-webpack-plugin');

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
                from: 'src/options_custom',
                to: 'src/options_custom'
            },
            {
                from: 'icons',
                to: 'icons',
            },
            {
                from: '_locales',
                to: '_locales'
            }
        ])

    ]
};
