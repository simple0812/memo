var glob = require('glob')
const helper = require('./helper');
var fs = require('fs')


var pages = getEntry(helper.root('src') +'/**/*.html');

for (var each of pages) {
    
    // 配置生成的html文件，定义路径等
    var conf = {
        favicon: 'src/favicon.ico',
        filename: each + '.html',
        template: each.path + '.html',   // 模板路径
        minify: {
            //removeComments: true,
            //collapseWhitespace: true,
            //removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency',
        chunks: [each.name, 'vendor', 'bootstrap']
    };
    console.log(each);
    //ctx.plugins.push(new HtmlWebpackPlugin(conf));
}

function getEntry(globPath) {
    var ret = [];
    glob.sync(globPath).forEach(function (entry) {
        tmp = entry.split('/').splice(-2);
        pathname = tmp[0]; // 正确输出js和html的路径
        var p = entry.split('/');
        p.pop();
        var x = p.join('/') + '/main.js';
        console.log(x)
        if(fs.existsSync(x)) {
            ret.push({
                name : pathname,
                path: entry
            })
        }
    });
    return ret;
}
