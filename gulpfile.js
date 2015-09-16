var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	filter = require('gulp-filter'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css');
	//imagemin = require('gulp-imagemin'),
	//pngquant = require('imagemin-pngquant');
	

gulp.task('sass', function() {
	return sass('wwwroot/scss/mississippi-grind.scss', {sourcemap:true})
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('wwwroot/css'))
		.pipe(filter('**/*.css'))
		.pipe(reload({stream: true}));
});

gulp.task('serve', ['sass'], function() {
	browserSync.init({
		server: {
            baseDir: "./wwwroot/"
        }
	});

	gulp.watch('wwwroot/**/*.scss', ['sass']);
	gulp.watch('wwwroot/**/*.html').on('change', reload);
	gulp.watch(['wwwroot/**/*.js','wwwroot/locations.json']).on('change', reload);
});

gulp.task('imagemin', function() {
	return gulp.src('wwwroot/images/**/*')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest('wwwroot/images'));
});

gulp.task('uglify', function() {
	gulp.src(['wwwroot/js/*.js', '!**/*.min.js'])
		.pipe(uglify())
		.pipe(gulp.dest('wwwroot/dist/js'))
});

gulp.task('minify', function(){
	gulp.src(['wwwroot/css/*.css', '!**/*.min.css'])
		.pipe(minifyCss())
		.pipe(gulp.dest('wwwroot/dist/css'));
})

gulp.task('default', ['serve']);

gulp.task('dist', ['uglify','minify','imagemin']);