var gulp       = require("gulp")
var seq        = require("run-sequence")
var del        = require("del")
var less       = require("gulp-less")
var concat     = require('gulp-concat');
var minify_css = require("gulp-minify-css")

gulp.task('default', function(cb) {
  seq('clean','static','bootstrap', cb)
})

gulp.task('clean', function(cb) {
  return del('public/bootstrap',cb)
})

gulp.task('static', function() {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js'])
    .pipe(gulp.dest('public/bootstrap/js'))
})

gulp.task('dependencies', function() {

})
gulp.task('bootstrap', function() {
  return gulp.src(["less/index.less"])
    .pipe(less())
    .pipe(minify_css())
    .pipe(concat("bootstrap.min.css"))
    .pipe(gulp.dest("public/bootstrap/css"))
});
