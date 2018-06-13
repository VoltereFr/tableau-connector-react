const webPathConf = require('../src/webPathConf');
const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaders = require('./loaders');

const projectWorkingDirectory = process.cwd();
module.exports = {
    cache: true,
    devServer: {
        port: 9090,
        open: true,
        public: 'my-local-machine.mybraincube.com:9090',
        headers: { 'Access-Control-Allow-Origin': 'https://mybraincube.com' },
        https: true,
        host: '0.0.0.0'
    },
    devtool: 'cheap-module-source-map',
    entry: ['babel-polyfill', 'whatwg-fetch', path.resolve(projectWorkingDirectory, 'src', 'index.jsx')],
    output: {
        filename: '[hash].[name].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: loaders
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'WEB_PATH_CONF': JSON.stringify(webPathConf.dev)
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            favicon: path.resolve(projectWorkingDirectory, 'src', 'favicon.ico'),
            template: path.resolve(projectWorkingDirectory, 'src', 'index.html')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        })
    ]
};
