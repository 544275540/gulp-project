//******************引入 gulp及其他组件
var proxy = require('http-proxy-middleware');
var gulp=require('gulp'),  //gulp基础库
    uglify=require('gulp-uglify'),   //js压缩
	minifyCSS = require('gulp-minify-css'),//css压缩
	sass = require('gulp-sass'),//sass压缩
	htmlmin = require('gulp-htmlmin'),//html压缩
	connect = require('gulp-connect'),//自动刷新组件
	browserSync = require('browser-sync').create(),//浏览器调试快速响应工具   此处为创建实例
	reload  = browserSync.reload;//响应简写
	webserver = require('gulp-webserver');	
//******************html压缩方案
	gulp.task('testHtmlmin', function () {
	    var options = {
	        removeComments: true,//清除HTML注释
	        collapseWhitespace: true,//压缩HTML
	        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
	        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
	        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
	        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
	        minifyJS: true,//压缩页面JS
	        minifyCSS: true//压缩页面CSS
	    };
		gulp.src('project/**/*.html')
			.pipe(htmlmin(options))
			.pipe(gulp.dest('min-project'))
			.pipe(reload({stream:true}))
	});
//******************scss处理
	gulp.task('scss', function () {
		gulp.src('project/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest('min-project'))
		.pipe(reload({stream:true}))
	})
//******************js压缩处理方案
	gulp.task('script', function() {
		gulp.src('project/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('min-project'))
		.pipe(reload({stream:true}))
	})
	
//******************服务器代理设置
	var jsonPlaceholderProxy = proxy('/api', {
//	    target: 'http://192.168.8.66:8081',//可为局域网内地址或公网固定地址(如：'http://www.baidu.com')
		target: 'http://localhost:8080',
	   	changeOrigin: true,             //修改目标到当前地址进行代理
	   	pathRewrite: {
	     	'^/api': '/api',
	   	},
	   	logLevel: 'debug'
	})
//	var login = proxy('/login', {//此处设置其他接口配置
////	    target: 'http://192.168.xx.xx:xxxx',
//	   	changeOrigin: true,             
//	   	pathRewrite: {
//	     	'^/login': '/login',
//	   	},
//	   	logLevel: 'debug'
//	})
//******************gulp执行后的首页加载及
	gulp.task('connect', function() {
		browserSync.init({ 
			server: {
		     	baseDir:'./',//服务器启动处为根目录
		     	index:'index.html',
		    	middleware:[jsonPlaceholderProxy],//中间件      此处只引用代理配置
		   	},
		   	port:8080,
		   	startPath:'/',//从当前目录启动
		});  
	})
//******************监听是否发生变动
	gulp.task('watch', function() {
		//	//html
			gulp.watch('project/**/*.html',['testHtmlmin']).on('change', reload);
		//	//js
			gulp.watch('project/**/*.js',['script']).on('change', reload);
	    //  //css
			gulp.watch(
				'project/**/*.scss',//此处的地址对应头部配置时的地址
				['scss']).on('change',
				reload
			);
	})
gulp.task('default', ['scss','script','testHtmlmin','watch','connect'])