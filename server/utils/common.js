var _ = require('underscore');
var config = require('../config');
var request = require('request');
var Promise = require('bluebird');
var fs = require('fs');

module.exports = {
    //subClass.prototype添加的属性都必须位置 extend之后, 否则子类的同名方法会被父类的覆盖
    extend: function extend(subClass, superClass) {
        var F = function() {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;

        subClass.superClass = superClass;
        if (superClass.prototype.constructor == Object.prototype.constructor)
            superClass.prototype.constructor = superClass;
    },

    deepClone: function deepCopy(source) {
        if (typeof source !== 'object') {
            return source;
        }

        if (Object.prototype.toString.call(source) == '[object Date]') {
            return new Date(source.getTime());
        } else if (Object.prototype.toString.call(source[key]) == '[object Array]') {
            return source[key].slice(0);
        }

        var result = new source.constructor();

        for (var key in source) {
            if (typeof source[key] === 'object') {
                if (Object.prototype.toString.call(source[key]) == '[object Date]') {
                    result[key] = new Date(source[key].getTime());
                } else if (Object.prototype.toString.call(source[key]) == '[object Array]') {
                    result[key] = source[key].slice(0);
                } else {
                    result[key] = deepCopy(source[key]);
                }
            } else {
                result[key] = source[key];
            }
        }
        return result;
    },

    sign: function(json, secretKey) {
        var keys = [];
        //取得所有的key
        for (var key in json) {
            if (key === 'sign') {
                continue;
            }
            keys.push(key);
        }
        //按字典排序
        keys.sort();
        var len = keys.length;

        var p = '';

        for (var i = 0; i < len; i++) {
            if ((typeof json[keys[i]]) === 'object') {
                p += keys[i] + '=' + JSON.stringify(json[keys[i]]) + '&';
            } else {
                p += keys[i] + '=' + json[keys[i]] + '&';
            }
        }

        return require('crypto').createHash('md5').update(p + secretKey).digest('hex');
    },

    md5: function(str) {
        return require('crypto').createHash('md5').update(str).digest('hex');
    },

    packData: function(data, action) {
        var obj = {
            action: action || '',
            data: data || '',
            type: _.isObject(data) ? 'json' : 'text'
        };

        var p = JSON.stringify(obj);
        var ret = '|>' + p.length + '<|' + p;

        return ret;
    },

    generateRand: function(len) {
        len = len || 8;
        var chars = ['2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c',
            'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y'
        ];
        var res = '';
        for (var i = 0; i < len; i++) {
            var id = Math.floor(Math.random() * chars.length);
            res += chars[id];
        }
        return res;
    },

    format: function() {
        if (arguments.length === 0) {
            return null;
        }

        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }

        return str;
    },

    tryParse: function(str) {
        var i = parseInt(str);
        if (Number.isNaN(i)) {
            i = arguments[1] || 0;
        }

        return i;
    },

    tryStringify: function(obj) {
        if (typeof obj === 'string') return obj;
        var str = arguments[1] || '';
        try {
            str = JSON.stringify(obj);
        } catch (err) {

        }

        return str;
    },

    getTime: function() {
        return ~~(new Date().getTime() / 1000);
    },

    parseUrl: function(url, key) {
        var value = '';
        var sURL = decodeURI(url);
        if (sURL.indexOf('?') > 0) {
            var arrayParams = sURL.split('?');
            var arrayURLParams = arrayParams[1].split('&');

            for (var i = 0; i < arrayURLParams.length; i++) {
                var sParam = arrayURLParams[i].split('=');

                if ((sParam[0] === key) && (sParam[1] !== '')) {
                    value = sParam[1];
                    break;
                }
            }
        }

        return value;
    },

    getClientIp: function(req) {
        var ipAddress;
        var forwardedIpsStr = req.header('x-forwarded-for');
        if (forwardedIpsStr) {
            var forwardedIps = forwardedIpsStr.split(',');
            ipAddress = forwardedIps[0];
        }
        if (!ipAddress) {
            ipAddress = req.connection.remoteAddress;
        }
        return ipAddress;
    },

};

/***************js对象扩展方法*****************/
Function.prototype._xbind = function(oThis) {
    if (typeof this !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function() {},
        fBound = function() {
            var p = Array.prototype.slice.call(arguments).concat(aArgs);
            var x = p.slice(0, 2);
            //render 只能有2个参数 当参数个数大于2个的时候将后面所有参数合并到第2个参数
            if (p.length > 2) {
                var t = p.slice(2);
                for (var i = 0; i < t.length; i++) {
                    for (var key in t[i]) {
                        if (!x[1][key]) {
                            x[1][key] = t[i][key];
                        }
                    }
                }
            }

            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, x);
        };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
};