var nodemailer = require('nodemailer');

module.exports = {
  send: function(options, cb) {
    cb = cb || function() {};
    var smtpTransport = nodemailer.createTransport('smtps://493814813%40qq.com:qioushuo8215@smtp.qq.com');

    var mailOptions = {
      from: '493814813@qq.com', // 发件地址
      to: options.To, // 收件列表
      subject: 'iot异常信息', // 标题
      text: options.Message || '' // html 内容
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
      cb(error, response);
      smtpTransport.close(); // 如果没用，关闭连接池
    });
  }
};