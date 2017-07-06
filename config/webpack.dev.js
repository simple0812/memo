
const helper = require('./helper');
const webpackMerge = require('webpack-merge');
const webpackMergeDll = webpackMerge.strategy({ plugins: 'replace' });
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const webpack = require('webpack');
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const HMR = helper.hasProcessFlag('hot');
const AssetsPlugin = require('assets-webpack-plugin');

const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;

module.exports = function() {
  return webpackMerge(commonConfig(), {
    devtool: 'cheap-module-source-map',
    output: {
      path: helper.root('dist'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[id].chunk.js',
      library: 'ac_[name]',
      libraryTarget: 'var',
    },

    plugins: [
      new DefinePlugin({
        'ENV': JSON.stringify(ENV),
        'HMR': HMR,
        'process.env': {
            'ENV': JSON.stringify(ENV),
            'NODE_ENV': JSON.stringify(ENV),
            'HMR': HMR,
        }
      }),

      new webpack.DllReferencePlugin({
        manifest: require('../dll/vendor-manifest.json'),
      }),
      
      new AddAssetHtmlPlugin([
        { filepath: helper.root(`dll/vendor.dll.js`), includeSourcemap:true }
      ]),
    
      new LoaderOptionsPlugin({
        debug: true,
        options: {
        }
      }),
    ],

    devServer: {
      port: PORT,
      host: HOST,
      historyApiFallback: true,
      proxy: [{
        context: ['/api', ],
        target: 'http://localhost:5555',
        secure: false
      }],
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
    },
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  });
}