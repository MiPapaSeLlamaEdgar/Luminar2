const gulp = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const rename = require('gulp-rename');

// Tarea para limpiar el directorio de destino
gulp.task('clean', () => {
    return gulp.src('dist', { read: false, allowEmpty: true })  // Elimina el directorio 'dist' si existe
        .pipe(clean());
});

// Tarea para compilar Sass a CSS
gulp.task('styles', () => {
    return gulp.src('src/styles/**/*.scss')  // Selecciona todos los archivos .scss
        .pipe(sass().on('error', sass.logError))  // Compila los archivos .scss a CSS
        .pipe(concat('styles.css'))  // Combina todos los archivos CSS en uno solo
        .pipe(gulp.dest('dist/css'));  // Guarda el archivo combinado en 'dist/css'
});

// Tarea de compilación principal
gulp.task('build', gulp.series('clean', 'styles'));

// Tarea predeterminada para ejecutar la compilación
gulp.task('default', gulp.series('build'));
