module.exports = {
  md5: function(str) {
    return require('crypto').createHash('md5').update(str).digest('hex');
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
  getTime: function() {
    return ~~(new Date().getTime() / 1000);
  }
};