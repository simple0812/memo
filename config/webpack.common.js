/* 引入操作路径模块和webpack */
var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
var fs = require('fs');
const helper = require('./helper');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var ctx =  {
    /* 输入文件 */
  entry: {
    'bootstrap':'bootstrap',
    'vendor': './src/vendor.js'
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    alias:{
      'vue':'vue/dist/vue.js'
    },
    extensions: ['.vue', '.js', '.json'],
    modules: [helper.root('src'), helper.root('node_modules')],
  },
  output: {
    /* 输出目录，没有则新建 */
    path: helper.root('dist'),
    /* 文件名 */
    filename: '[name].[chunkhash].bundle.js',

    sourceMapFilename: '[name].[chunkhash].bundle.map',

    chunkFilename: '[id].[chunkhash].chunk.js'
  },
  module: {
    rules: [
      /* 用来解析vue后缀的文件 */
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      /* 用babel来解析js文件并把es6的语法转换成浏览器认识的语法 */
      {
        test: /\.js$/,
        loader: 'babel-loader',
        /* 排除模块安装目录的文件 */
        exclude: /node_modules/,
        query: { presets: ['es2015']}
      },
  
      /*
      * to string and css loader support for *.css files (from Angular components)
      * Returns file content as string
      *
      */
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
        exclude: [helper.root('src', 'styles')]
      },

      //如果启用该行 会导致<%= htmlWebpackPlugin.options.title %>直接输出到页面 而不会编译后在输出
      // {
      //     test: /\.html$/,
      //     use: 'raw-loader',
      //     exclude: [helper.root('src/index.html')]
      // },

      /* 
          * File loader for supporting images, for example, in CSS files.
          */
      {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader'
      },

      /* File loader for supporting fonts, for example, in CSS files.
          */
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
  
  plugins:[
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery'
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets' },
    ])
  ],
  devServer: {
    historyApiFallback: true,
    proxy: [{
        context: ['/api'],
        target: 'http://localhost:5555',
        secure: false
    }],
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
  },

  /*
  * Include polyfills or mocks for various node stuff
  * Description: Node configuration
  *
  * See: https://webpack.github.io/docs/configuration.html#node
  */
  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
}

module.exports = function() {
  var pages = getEntry(helper.root('src') +'/**/*.html');
  var chunks = [];
  for (var each of pages) {
    var conf = {
      favicon: 'src/favicon.ico',
      filename: each.dirname + '.html',
      template: `src/${each.dirname}/${each.filename}.html`,
      chunksSortMode: 'dependency',
      chunks: ['common', each.dirname, 'vendor', 'bootstrap']
    };

    ctx.entry[each.dirname] = `./src/${each.dirname}/${each.filename}.js`;
    ctx.plugins.push(new HtmlWebpackPlugin(conf));
    chunks.push(each.dirname);
  }

  var plugin = new webpack.optimize.CommonsChunkPlugin({
    name:'common',
    chunks:chunks
  });
  ctx.plugins.push(plugin);
  return ctx;
}

//寻找src目录下所有html文件 并且该html文件所在文件夹中包含同名的js文件 则只用webpack打包该文件html文件
function getEntry(globPath) {
  var ret = [];
  glob.sync(globPath).forEach(function (entry) {
    var tmp = entry.split('/').splice(-2);
    var dirname = tmp[0]; // 正确输出js和html的路径
    var filename = tmp[1].split('.')[0];
    var p = entry.split('/');
    p.pop();
    var x = p.join('/') + `/${filename}.js`;

    if(fs.existsSync(x)) {
      ret.push({
        dirname: dirname,
        filename: filename,
        path: entry
      })
    }
  });

  return ret;
}
