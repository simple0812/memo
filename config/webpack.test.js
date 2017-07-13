const helper = require('./helper');

const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = function(options) {
  return {
    devtool: 'inline-source-map',
    resolve: {
      alias:{
        'vue':'vue/dist/vue.js'
      },
      extensions: ['.vue', '.js', '.json'],
      modules: [helper.root('src'), helper.root('node_modules')],
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: { presets: ['es2015']}
        },
    
        {
          test: /\.css$/,
          use: ['to-string-loader', 'css-loader'],
          exclude: [helper.root('src', 'styles')]
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: 'file-loader'
        },
        {
          test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
          use: 'file-loader'
        },
        {
          test: require.resolve('jquery'), // 此loader配置项的目标是NPM中的jquery
          loader: 'expose-loader?jQuery!expose-loader?$', // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`
        }
      ]
    },
    plugins: [
      new ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
          'window.$': 'jquery'
      }),

      new DefinePlugin({
          'ENV': JSON.stringify(ENV),
          'HMR': false,
          'process.env': {
              'ENV': JSON.stringify(ENV),
              'NODE_ENV': JSON.stringify(ENV),
              'HMR': false,
          }
      }),

      new LoaderOptionsPlugin({
          debug: false,
          options: {
              // legacy options go here
          }
      }),
    ],

    performance: {
        hints: false
    },

    node: {
        global: true,
        process: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
  };
}