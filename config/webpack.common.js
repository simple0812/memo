/* 引入操作路径模块和webpack */
var path = require('path');
var webpack = require('webpack');
const helper = require('./helper');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function() {
    return  {
        /* 输入文件 */
        entry: {
            'main':'./src/index/main.js',
            'pagea':'./src/pageA/main.js',
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
            ]),

            new HtmlWebpackPlugin({
                favicon: 'src/favicon.ico',
                filename: 'index.html',
                title:'test',
                template: 'src/index/index.html',
                chunksSortMode: 'dependency',
                chunks: ['main', 'vendor', 'bootstrap']
            }),

            new HtmlWebpackPlugin({
                favicon: 'src/favicon.ico',
                filename: 'pagea.html',
                title:'pagea',
                template: 'src/pageA/index.html',
                chunksSortMode: 'dependency',
                chunks: ['vendor','pagea']
            })
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
}