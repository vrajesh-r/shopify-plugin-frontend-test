const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const yaml = require('js-yaml');

function loadConfig() {
  const { ENVIRONMENT = 'local', CONFIG_FILE_PATH = './deploy/chart', CONFIG_FILE_NAME = 'config.yaml' } = process.env;
  const filePath = path.join(CONFIG_FILE_PATH, ENVIRONMENT, CONFIG_FILE_NAME);
  const config = yaml.load(fs.readFileSync(filePath, 'utf8'));
  return config.templates.files.index.values || {};
}

const appConfig = {
  ...loadConfig(),
};

module.exports = (env) => {
  return {
    entry: './app/gateway/src/app.jsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'gateway/src/app.js',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      disableHostCheck: true,
      host: '0.0.0.0',
      index: 'gateway/index.html',
      port: env.LOCAL_PORT || 8000,
    },
    module: {
      rules: [
        {
          test: /\.js?x$/,
          exclude: [/node_modules/],
          use: ['babel-loader'],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(jpe?g|png|webp|gif|svg|ico)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'gateway/assets',
                name: '[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({}),
      new HtmlWebpackPlugin({
        template: './app/gateway/html/index.html',
        filename: 'gateway/index.html',
        minify: false,
        appConfig,
      }),
      new MiniCssExtractPlugin({
        filename: 'gateway/[name].css',
      }),
    ],
  };
};
