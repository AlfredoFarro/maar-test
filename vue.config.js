/* eslint-disable*/
const path = require('path')
const webpack = require('webpack');
require("dotenv").config();
module.exports = {
  devServer: {
    host: 'localhost',
  },
  publicPath: '/',
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: ['./node_modules', './src/assets'],
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@themeConfig': path.resolve(__dirname, 'themeConfig.js'),
        '@core': path.resolve(__dirname, 'src/@core'),
        '@validations': path.resolve(__dirname, 'src/plugin/vee-validate.js'),
        '@axios': path.resolve(__dirname, 'src/libs/axios'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
          // allow access to process.env from within the vue app
          'process.env': {
              NODE_ENV: JSON.stringify(process.env.NODE_ENV),
              APIURL: JSON.stringify(process.env.APIURL),
              APIURLFILE: JSON.stringify(process.env.APIURL_FILE),
          }
      })
    ]
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // eslint-disable-next-line no-param-reassign
        options.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href',
          'b-avatar': 'src',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src',
        }
        return options
      })
  },
  transpileDependencies: ['vue-echarts', 'resize-detector'],
}
