
var gulp = require('gulp');//gulp主文件

var loda = require('./config/index.js');
var lodb = require('./config/file.js');
var lodc = require('./config/server.js');



//启动研发服务器
gulp.task('default', ['browser','htmlmin','cssmin','scss','jsmin','watch','copy','copyFile'])

//启动打包
// gulp.task('build', ['build','cssmin', 'htmlmin', 'jsmin', 'copy', 'ico', 'copyimgs'])
