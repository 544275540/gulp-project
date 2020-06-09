/**
***********插件引入
**/
	//gulp核心插件
var gulp = require('gulp'),//gulp主文件
    concat = require('gulp-concat'),//gulp文件合并插件
	rename = require('gulp-rename'),//gulp重命名插件
	
	//1.html压缩
	htmlmin = require('gulp-htmlmin'),
	
	//2.css及scss压缩
    minifyCss = require('gulp-minify-css'),//css压缩
	sass = require('gulp-sass'),//sass压缩
	
	//3.图片压缩
	imageMin = require('gulp-imagemin'),
	// pngquant = require('imagemin-pngquant'); 
	
	//4.js压缩
	uglify = require('gulp-uglify'),//js压缩
	babel = require('gulp-babel'),//babel转换ES6
	gulp_remove_logging = require("gulp-remove-logging"),//代码中清除所有控制台输出
	
	//5.第三方
    // jshint = require('gulp-jshint'),//脚本检查插件
	rjs = require('requirejs'),//requires核心文件
    requireOptimize = require('gulp-requirejs-optimize'),//gulp+require.js  模块打包解析
	assetRev = require('gulp-asset-rev'),//通过添加内容哈希值来替换文件名
	rev = require('gulp-rev'),//为静态文件随机添加一串hash值, 解决cdn缓存问题
	revCollector = require('gulp-rev-collector'),//根据rev生成的manifest.json文件中的映射, 去替换文件名称, 也可以替换路径
	runSequence = require('run-sequence'),//gulp功能执行顺序
	del = require('del'),//这是一款删除文件的插件
	
	//6.服务器相关
	proxy = require('http-proxy-middleware'),//启动http相关
    browserSync = require('browser-sync'),//热更新工具创建实例
	reload  = browserSync.reload;//响应简写
	
    
/**
***********定义快捷路径
**/
var paths = {
    scripts: [
        ['./project/**/*.css', './assets/**/*.js', './project/**/*.js', './project/**/*.html', 'main.js']
    ]
};



/**
***********插件配置
**/

//1.html相关插件及配置
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src(['./project/**/*.html'])
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/'))
		.pipe(reload({stream:true}));
})


//2.css及scss相关插件及配置
// css压缩及其他插件
gulp.task('cssmin', function () {
    gulp.src(['./project/**/*.css'])
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'))
		.pipe(reload({stream:true}));
})
//scss处理
	gulp.task('scss', function () {
		gulp.src('./project/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream:true}))
	})


//3.js相关插件及配置
// 压缩js文件及去除console
gulp.task('jsmin', function () {
	gulp.src('./project/**/*.js')
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist'))
		.pipe(gulp_remove_logging({
		        namespace: ['console']
		}))
		.pipe(reload({stream:true}));
})
//脚本检查  
// gulp.task('lint', function () {
//     gulp.src('./project/**/*.js')
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });


//4.图片相关插件及配置
// 压缩图片
gulp.task('images', function () {
    gulp.src('./project/static/*.*')
        .pipe(imageMin({
            progressive: true, // 无损压缩JPG图片  
            svgoPlugins: [{
                removeViewBox: false
            }], // 不移除svg的viewbox属性  
            use: [pngquant()] // 使用pngquant插件进行深度压缩  
        }))
        .pipe(gulp.dest('dist/static'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('images-login', function () {
    gulp.src('./project/static/*.*')
        .pipe(imageMin({
            progressive: true,
 // 无损压缩JPG图片  
            svgoPlugins: [{
                removeViewBox: false
            }], 
// 不移除svg的viewbox属性  
            use: [pngquant()] 
// 使用pngquant插件进行深度压缩  
        }))
        .pipe(gulp.dest('dist/imgs'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


//5.图片相关插件及配置
//ico文件copy到dist上线  
gulp.task('ico', function (cb) {
    gulp.src(['favicon.ico'])
        .pipe(gulp.dest('dist/'))
});
// 将静态文件copy到dist
gulp.task('copy', function () {
    gulp.src(['./project/assets/**'])
        .pipe(gulp.dest('dist/assets'))
});
//将图片文件copy到dist
gulp.task('copyimgs', function () {
    gulp.src(['./project/static/imgs/**'])
        .pipe(gulp.dest('dist/imgs'))
})

// //require合并  
gulp.task('rjs', function (cb) {
        rjs.optimize({
            baseUrl: "./js",
            mainConfigFile: "main.js",
            preserveLicenseComments: false,//去掉头部版权声明
            removeCombined: false, //自动删除被合并过的文件
        }, 
		function (buildResponse) {
            // console.log('build response', buildResponse);
            cb();
        }, cb)
});
// js主文件合并
gulp.task('build', function (done) {
    condition = false;
    runSequence(
        ['removelog'] ,['rjs'],
        done);
});

// 当文件更改时重新运行任务  热更新
gulp.task('watch', function () {
	//  //css
		gulp.watch('./project/**/*.scss',['scss']).on('change', browserSync.reload);
	//	//js
		gulp.watch('./project/**/*.js',['script']).on('change', browserSync.reload);
	//	//html
		gulp.watch('./project/**/*.html',['testHtmlmin']).on('change', browserSync.reload);
	
});
//合并压缩包
gulp.task('watch', function () {
	//  //css
		gulp.watch('./project/**/*.scss',['scss']).on('change', browserSync.reload);
	//	//js
		gulp.watch('./project/**/*.js',['script']).on('change', browserSync.reload);
	//	//html
		gulp.watch('./project/**/*.html',['testHtmlmin']).on('change', browserSync.reload);
	//合并压缩包
		gulp.watch(paths.scripts, ['rjs']).on('change', function (event) {})
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
        files: ['./css/*.css', './*.js', './js/**/*.js', './tpls/*.html'],
        server:{
            baseDir:'./dist',
            index:'./dist/index.html',
			middleware:[jsonPlaceholderProxy],//中间件      此处只引用代理配置
        },
        port: 80
    })
})



//运行gulp
// gulp.task('dev', [ 'browser')//启动服务器
// gulp.task('dist', ['build','cssmin', 'htmlmin', 'jsmin', 'copy', 'ico', 'copyimgs'])//执行插件配置
	
	
gulp.task('default', ['htmlmin','cssmin','scss','jsmin','watch','browser'])