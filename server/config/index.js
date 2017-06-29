var path = require('path');
var fsx = require('fs-extra');

fsx.ensureDir(path.resolve(__dirname, '../../uploads') + '/appxs')
module.exports = {
    ROOT: __dirname,
    PORT: 5555,
    FILE_DIR: path.resolve(__dirname, '../../files'),
    LOG_DIR: path.resolve(__dirname, '../../logs'),
    UPLOAD_DIR: path.resolve(__dirname, '../../uploads'),
    APPX_DIR: path.resolve(__dirname, '../../uploads') + '/appxs',
    DB: {
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'memo'
    }
};