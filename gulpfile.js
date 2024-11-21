const gulp = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');

// Tareas de ejemplo
gulp.task('clean', () => {
    return gulp.src('dist', { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task('styles', () => {
    return gulp.src('src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build', gulp.series('clean', 'styles'));
