/*
 * Author: long
 * Date: 2020.9.24
 * Version: 1.0.0
 * Description: 文件处理机制
 * Function List: 
 * History:
 * Others:
*/



	//gulp核心插件
var gulp = require('gulp'),//gulp主文件
	
	
	//基础文件操作
	concat = require('gulp-concat'),//gulp文件合并插件
	rename = require('gulp-rename');//gulp重命名插件
	//	del = require('del'),//这是一款删除文件的插件
	//	import cache from 'gulp-cache';//缓存文件管理	
	
	
    // jshint = require('gulp-jshint'),//脚本检查插件
	//	rjs = require('requirejs'),//requires核心文件
	//  requireOptimize = require('gulp-requirejs-optimize'),//gulp+require.js  模块打包解析
	//	assetRev = require('gulp-asset-rev'),//通过添加内容哈希值来替换文件名
	//	rev = require('gulp-rev'),//为静态文件随机添加一串hash值, 解决cdn缓存问题
	//	revCollector = require('gulp-rev-collector'),//根据rev生成的manifest.json文件中的映射, 去替换文件名称, 也可以替换路径
	//	runSequence = require('run-sequence'),//gulp功能执行顺序
	

	

/**
***********插件配置
**/






// 将静态文件copy到dist
gulp.task('copy', function () {
    gulp.src(['./project/assets/**'])
        .pipe(gulp.dest('dist/assets'))
});
//基础默认文件导入到dist文件夹
gulp.task('copyFile', function () {
    gulp.src(['./public/**'])
        .pipe(gulp.dest('dist'))
})


//脚本检查  
// gulp.task('lint', function () {
//     gulp.src('./project/**/*.js')
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });



//6.requirejs 拼接合并
// //require合并  
//gulp.task('rjs', function (cb) {
//      rjs.optimize({
//          baseUrl: "./js",
//          mainConfigFile: "main.js",
//          preserveLicenseComments: false,//去掉头部版权声明
//          removeCombined: false, //自动删除被合并过的文件
//      }, 
//		function (buildResponse) {
//          // console.log('build response', buildResponse);
//          cb();
//      }, cb)
//});

// js主文件合并
gulp.task('build', function (done) {
    condition = false;
    runSequence(
        ['removelog'] ,['rjs'],
        done);
});


	
