var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var jasmine = require('gulp-jasmine');
var clean = require('gulp-clean');

//服务端语法检测
gulp.task('jshint', function() {
	return gulp.src(['controllers/*.js', 'models/*.js', 'proxy/*.js', 'utils/*.js'])
		.pipe(plugins.jshint(require('./jshintConf')))
		.pipe(plugins.jshint.reporter('default'));
});

//jasmine
gulp.task('jasmine', function() {
	return gulp.src('test/*.js')
		.pipe(jasmine({
			// reporter: new reporters.JUnitXmlReporter()
		}));
})

gulp.task("default", ['rjs'], function() {
	console.log('finished default task');
})

gulp.task('watch', function() {
	gulp.watch('public/js/**', ['rjs'])
});