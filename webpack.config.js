module.exports = {
    entry: ['./src/components/index.js'],
    output: {
        filename: './src/dist/bundle.js'
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
        }
        ]
    }
};
