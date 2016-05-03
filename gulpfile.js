var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

var config = {
    index: ['src/index.html'],
    sass: {
        index: 'src/app.scss',
        all: ['src/**/*.scss']
    }
};

gulp.task('serve', function() {
    browserSync.init({
        server: './public'
    });
});

gulp.task('copy', function () {
    return gulp.src(config.index)
        .pipe(gulp.dest('public'));
});

gulp.task('sass', function() {
    return gulp.src(config.sass.index)
        .pipe(sass())
        .pipe(gulp.dest('public'))
        .pipe(browserSync.stream());
});

gulp.task('watch', ['build', 'serve'], function () {
    watch(config.index, function () {
        gulp.start('copy');        
    });
    
    watch('public/index.html', browserSync.reload);
    
    watch(config.sass.all, function () {
        gulp.start('sass');
    });
});

gulp.task('build', ['copy', 'sass']);

gulp.task('default', ['copy']);