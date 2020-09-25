/*
 * Author: long
 * Date: 2020.9.24
 * Version: 1.0.0
 * Description: gulp主要任务
 * Function List: 
 * History:
 * Others:
*/

//gulp核心插件
var gulp = require('gulp'),//gulp主文件
    
	
	//1.html压缩
	htmlmin = require('gulp-htmlmin'),
	
	//2.css及scss压缩
    minifyCss = require('gulp-minify-css'),//css压缩
	sass = require('gulp-sass'),//sass压缩
	
	//3.图片压缩
	imageMin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),//深度压缩 
	
	//4.js压缩
	uglify = require('gulp-uglify'),//js压缩
	babel = require('gulp-babel'),//babel转换ES6
	gulp_remove_logging = require("gulp-remove-logging"),//代码中清除所有控制台输出

	reload = require('browser-sync').reload;//热更新



/*
	***********基础打包配置
*/

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



//4.图片相关插件及配置
// 压缩图片
gulp.task('images', function () {
    gulp.src('./project/assets/*.*')
        .pipe(imageMin({
            progressive: true, // 无损压缩JPG图片  
            svgoPlugins: [{
                removeViewBox: false
            }], // 不移除svg的viewbox属性  
            use: [pngquant()] // 使用pngquant插件进行深度压缩  
        }))
        .pipe(gulp.dest('dist/assets'))
        .pipe(reload({stream: true}));
});

