/*
 * Author: long
 * Date: 2020.9.24
 * Version: 1.0.0
 * Description: 本地服务器
 * Function List: 
 * History:
 * Others:
*/

var gulp = require('gulp'),//gulp主文件
	proxy = require('http-proxy-middleware'),//启动http Proxy
    browserSync = require('browser-sync'),//热更新
	reload  = browserSync.reload;//响应简写

/**
***********定义快捷路径
**/
//var paths = {
//  scripts: [
//      ['./project/**/*.css', './assets/**/*.js', './project/**/*.js', './project/**/*.html', 'main.js']
//  ]
//};

//合并压缩包       当文件更改时重新运行任务  热更新
gulp.task('watch', function () {
	//  //css
		gulp.watch('./project/**/*.scss',['scss']).on('change', browserSync.reload);
		gulp.watch('./project/**/*.css',['cssmin']).on('change', browserSync.reload);
	//	//js
		gulp.watch('./project/**/*.js',['jsmin']).on('change', browserSync.reload);
	//	//html
		gulp.watch('./project/**/*.html',['htmlmin']).on('change', browserSync.reload);
	//合并压缩包
//		gulp.watch(paths.scripts, ['rjs']).on('change', function (event) {})
});
    


//利用gulp启动本地服务器
	//服务器代理设置
	var jsonPlaceholderProxy = proxy('/api', {
		target: 'http://192.168.3.66:8080',//可为局域网内地址或公网固定地址(如：'http://www.baidu.com')
	   	changeOrigin: true,             //修改目标到当前地址进行代理
	   	pathRewrite: {
	     	'^/api': '/api',
	   	},
	   	logLevel: 'debug'
	})
	
gulp.task('browser', function () {
    browserSync.init({
//  	notify: false,////不显示在浏览器中的任何通知。
        files: ['./css/*.css', './*.js', './js/**/*.js', './tpls/*.html'],
        server:{
            baseDir:'./dist',         //设置服务器的根目录
            index:'./index.html',      //在服务器根目录下打开指定文件
			middleware:[jsonPlaceholderProxy],//中间件      此处只引用代理配置
        },
        port: 8888,//端口号
//      startPath:'./',//启动目录
    })
})





