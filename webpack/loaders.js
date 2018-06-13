const path = require('path');

const currentWorkingDirectory = process.cwd();

module.exports = [
    {
        test: /\.(js|jsx)?$/,
        include: [
            path.resolve(currentWorkingDirectory, 'src'),
            path.resolve(currentWorkingDirectory, 'testsUI'),
            path.resolve(currentWorkingDirectory, 'node_modules/jso')
        ],
        loader: 'babel-loader?cacheDirectory'
    }, {
        test: /\.css?$/,
        include: [
            path.resolve(currentWorkingDirectory, 'src'),
            path.resolve(currentWorkingDirectory, 'node_modules/@braincube/brain-font/dist/'),
            path.resolve(currentWorkingDirectory, 'node_modules/@braincube/react-components/node_modules/react-virtualized/'),
            path.resolve(currentWorkingDirectory, 'node_modules/react-virtualized/'),
            path.resolve(currentWorkingDirectory, 'node_modules/react-datepicker/'),
            path.resolve(currentWorkingDirectory, 'node_modules/@braincube/react-components/node_modules/react-datepicker/dist/react-datepicker.css'
),
        ],
        loader: 'style-loader!css-loader'
    }, {
        test: /\.(gif|jpe?g|png)$/,
        include: [
            path.resolve(currentWorkingDirectory, 'src')
        ],
        loader: 'file-loader'
    }, {
        test: /\.(ttf|eot|svg|woff(2)?)(\?version=\w+\.\w+\.\w+)?$/,
        include: [
            path.resolve(currentWorkingDirectory, 'node_modules/@braincube/brain-font/dist/')
        ],
        loader: 'file-loader'
    }
];
