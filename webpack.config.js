const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: "index.html",
            favicon: "./src/assets/favicon_io/favicon.ico",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "src/assets/favicon_io",
                    to: "assets/favicon_io",
                    noErrorOnMissing: true
                },
            ],
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, "dist"),
        open: true,
        hot: true,
        compress: true,
        port: 3000,
    },
};