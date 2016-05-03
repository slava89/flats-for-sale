var gulp = require('gulp');
var seq = require('sequence-stream');
var watch = require('gulp-watch');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var ngTemplates = require('gulp-ng-templates');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

var config = {
    index: ['src/index.html'],
    templates: ['src/**/*.html', '!src/index.html'],
    sass: {
        index: 'src/app.scss',
        all: ['src/**/*.scss']
    },
    scripts: {
        app: ['src/app.js', 'src/**/*.js'],
        watch: ['src/**/*.js']
    }
};

gulp.task('nodemon', function () {
    nodemon({
        script: 'server',
        ignore: 'src/**/*.*',
        watch: ['server/**/*.js'],
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    })
        .on('restart', function () {
            browserSync.reload();
        });
});

gulp.task('serve', function () {
    browserSync.init({
        proxy: "localhost:" + (process.env.PORT || 5000),
        serveStatic: ['public']
    });
});

gulp.task('copy', function () {
    return gulp.src(config.index)
        .pipe(gulp.dest('public'));
});

gulp.task('sass', function () {
    return gulp.src(config.sass.index)
        .pipe(sass())
        .pipe(gulp.dest('public'))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    var app = gulp.src(config.scripts.app)
        .pipe(concat('app.js'));

    var templates = gulp.src(config.templates)
        .pipe(ngTemplates({
            module: 'app',
            standalone: false
        }))
        .pipe(concat('templates.js'));

    return seq([app, templates])
        .on('error', function (error) {
            console.log('seq', error.stack);
            this.emit('end');
        })
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public'));
});

gulp.task('js-watch', ['js'], function () {
    browserSync.reload();
});

gulp.task('watch', ['build', 'nodemon', 'serve'], function () {
    watch(config.index, function () {
        gulp.start('copy');
    });

    watch('public/index.html', browserSync.reload);

    watch(config.sass.all, function () {
        gulp.start('sass');
    });

    watch(config.scripts.watch, function () {
        gulp.start('js-watch');
    });

    watch(config.templates, function () {
        gulp.start('js-watch');
    });
});

gulp.task('build', ['copy', 'sass', 'js']);

gulp.task('default', ['copy']);