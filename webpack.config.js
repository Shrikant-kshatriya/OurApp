const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './frontend-js/script.js',
    output: {
        path: path.join(__dirname, 'public/script'),
        filename: 'script.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader",
                    options: {minimize: false}
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: {
                    loader: "file-loader",
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin,
                    "style-loader","css-loader","sass-loader"
                ]
            },
            {
                test: /\.ejs$/,
                use: [
                    "ejs-loader"
                ]
            }
        ]
    },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: "./src/index.html",
    //         filename: "../views/index.ejs"
    //     }),
    //     new MiniCssExtractPlugin({
    //         filename: "[name].[hash].css",
    //         chunkFilename: "[id].[hash].css"
    //     })
    // ]
}