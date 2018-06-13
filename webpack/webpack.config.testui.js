const webPathConf = require('../src/webPathConf');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaders = require('./loaders');

const projectWorkingDirectory = process.cwd();

const components = fs.readdirSync(path.resolve(projectWorkingDirectory, 'testsUI', 'tests', 'components'));

module.exports = {
    cache: true,
    devServer: {
        port: 9090,
        https: true,
        public: 'localhost:9090',
        host: '0.0.0.0'
    },
    entry: components.reduce((acc, curr, i) => {
        acc[i] = path.resolve(projectWorkingDirectory, 'testsUI', 'tests', 'components', curr, 'index.jsx');
        return acc;
    }, {}),
    output: {
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: loaders
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'WEB_PATH_CONF': JSON.stringify(webPathConf.dev)
        })
    ].concat(
        components.map(component => {
            return new HtmlWebpackPlugin({
                filename: path.resolve(projectWorkingDirectory, 'testsUI', 'pages', 'components', component, 'index.html'),
                template: path.resolve( projectWorkingDirectory, 'testsUI', 'pages', 'index.ejs'),
                component: component
            })
        })
    )
};
