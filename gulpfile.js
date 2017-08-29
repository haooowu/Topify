const gulp = require("gulp");
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
//a task to compile our sass
// gulp.task('bacon',function(){
// 	console.log('bbbbb');
// });
gulp.task('styles', () => {
	//single ling no return..
	return gulp.src('./dev/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles/'))
		//dest?
});

//task that complie js
gulp.task('scripts', () => {
	return gulp.src('./dev/scripts/main.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./public/scripts'))
});

//a task to watch all of my other tasks
gulp.task('watch', function() {
	gulp.watch('./dev/scripts/*.js', ['scripts']);
	gulp.watch('./dev/styles/*.scss', ['styles']);
	// gulp.watch('*.html', reload);
});

gulp.task('default', ['styles', 'scripts', 'watch']);