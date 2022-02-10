const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require('webpack').container;
const path = require("path");


module.exports = function (_, args) {
  const DEV_MODE = args.mode === "development";

  const plugins = [
    DEV_MODE ? undefined : new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public/index.html'),
    }),
    new ModuleFederationPlugin({
      name: 'MonorepoEntry',
      remotes: {
        MonorepoVueComponent: 'MonorepoVueComponent@http://localhost:3001/remoteEntry.js'
      },
      shared: {
        vue: {
          singleton: true
        },
        'vue-router': {
          singleton: true,
        }
      }
    }),
    new VueLoaderPlugin(),
  ].filter(item => item !== undefined)

  return {
    context: __dirname,
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
      },
      extensions: [".vue", '.ts', ".js", ".mjs"],
    },
    output: {
      publicPath: "auto",
      path: path.join(__dirname, "dist"),
      chunkFilename: "[name].chunk.js",
      filename: "[name].js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                // to tell ts-loader don't performs typechecking
                // because we use volar type checking at running
                // using vue-tsc at building
                transpileOnly: true
              }
            }
          ],
          exclude: [/node_modules/i],
        },
        {
          test: /\.vue$/i,
          loader: "vue-loader",
          exclude: [/node_modules/i],
        },
        {
          test: /\.css$/,
          exclude: [/node_modules/i],
          use: [
            DEV_MODE ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      compress: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },
    // make output more readable
    devtool: DEV_MODE ? false : undefined,
    optimization: {
      minimize: DEV_MODE ? false : undefined,
    },
    plugins
  }
}
