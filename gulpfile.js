const gulp = require("gulp");
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
//a task to compile our sass
// gulp.task('bacon',function(){
// 	console.log('bbbbb');
// });
gulp.task('styles', () => {
	return gulp.src('./dev/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles'))
		.pipe(reload({stream: true}));
});

//task that complie js
gulp.task('scripts', () => {
	return gulp.src('./dev/scripts/main.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./public/scripts'))
		.pipe(reload({stream: true}));
});

//a task to watch all of my other tasks
gulp.task('watch', function() {
	gulp.watch('./dev/scripts/*.js', ['scripts']);
	gulp.watch('./dev/styles/*.scss', ['styles']);
	gulp.watch('*.html', reload);
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: '.'
  })
});

gulp.task('default', ['browser-sync','styles', 'scripts', 'watch']);