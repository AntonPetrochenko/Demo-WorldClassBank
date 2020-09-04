const gulp = require("gulp")
const sass = require("gulp-sass")
const webp = require("gulp-webp")
const concat = require("gulp-concat")

sass.compiler = require('sass');
 
gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('merged.css'))
        .pipe(gulp.dest('./style'));
    }
);
   
gulp.task('sass:watch', function () {
    gulp.watch('./sass/*.scss', gulp.series('sass'));
});