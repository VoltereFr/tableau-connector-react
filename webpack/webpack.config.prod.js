const webPathConf = require('../src/webPathConf');
const webpack = require('webpack');
const pkg = require('../package.json');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const loaders = require('./loaders');

const projectWorkingDirectory = process.cwd();

module.exports = {
    cache: true,
    devtool: 'nosources-source-map',
    entry: ['babel-polyfill', 'whatwg-fetch', path.resolve(projectWorkingDirectory, 'src', 'index.jsx')],
    output: {
        filename: '[hash].[name].js',
        path: path.resolve(projectWorkingDirectory, 'build')
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: loaders
    },
    // optimization: {
    //     minimize: false
    // },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'WEB_PATH_CONF': JSON.stringify(webPathConf.prod)
        }),
        new webpack.BannerPlugin(`${pkg.name} v${pkg.version}`),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            favicon: path.resolve(projectWorkingDirectory, 'src', 'favicon.ico'),
            template: path.resolve(projectWorkingDirectory, 'src', 'index.html')
        }),
        new PreloadWebpackPlugin({
            rel: 'preload',
            include: 'all'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.npm_config_analyze !== undefined ? 'server' : 'disabled',
            generateStatsFile: process.env.npm_config_analyze === undefined
        })
    ]
};
