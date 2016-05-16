module.exports = {
    entry: {
        bundle: './src/components/index.js', 
        event: './src/bg/eventPage.js'
    },
    output: {
        path: './src/dist',
        filename: '[name].js'
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
    }
};
