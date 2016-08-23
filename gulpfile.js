var gulp       = require('gulp'),           // 引入 gulp
    config     = require('./config.json'),  //引入本地配置文件
    jshint     = require('gulp-jshint'),    //js检查
    sass       = require('gulp-sass'),      
    webserver  = require('gulp-webserver'), //建立本地服务器
    opn        = require('opn'),            //opn 是打开浏览器的插件
    livereload = require('gulp-livereload');//本地更改刷新服务器
    //第二阶段用的插件
var concat     = require('gulp-concat'),   //合并文件
    uglify     = require('gulp-uglify'),     //压缩js文件
    htmlmin    = require('gulp-htmlmin'),   //压缩html
    rename     = require('gulp-rename'),     //重命名
    imagemin   = require('gulp-imagemin'),    //压缩图片的第一个插件(1)
    tinypng    = require('gulp-tinypng'),      //压缩图片2，国外的，更好用
    zip        = require('gulp-zip'),       //给app打包，一般使用git
    csslint    = require('gulp-csslint'),    //检查css是否有错
    uncss      = require('gulp-uncss');        //为bootstrap提出用到的css
// 检查 js，有没有报错或警告。
gulp.task('lint', function(cb) {
    gulp.src('./test/js/*.js')
        .pipe(jshint())   
        .pipe(jshint.reporter('default'));
    cb();
});
// 编译Sass。并检查css
gulp.task('sass', function(cb) {
    gulp.src('./test/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        // .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./test/css'))
        cb()
});

//开启本地 Web,livereload 可以自动刷新浏览器(chrome)
gulp.task('webserver', function(cb) {
  gulp.src( './' )
    .pipe(webserver({
      host:             config.localserver.host,
      port:             config.localserver.port,
      livereload:       true,
      directoryListing: false
    }));
    cb();
});

//单独放在task中会重新打开网页，放在另外挂task中可以刷新
gulp.task('openbrowser',function() {
  opn( 'http://' + config.localserver.host + ':' + config.localserver.port +"/" + config.testHtmlAddress);
});

//一但修改就在配置的网页中刷新,默认任务
gulp.task('default',['webserver','openbrowser'],function(){
    gulp.watch(['./test/scss/*.scss'],['sass']);
    gulp.watch(['./test/js/*.js'],['lint'])
    gulp.watch(['./test/*.html'],function(){
        gulp.run('openbrowser',function(){
            console.log('=======success=======')
        }); 
    });
});

//css检查
gulp.task('css', function() {
  gulp.src('client/css/*.css')
    .pipe(csslint())
    .pipe(csslint.formatter());
});

//将bootstrap中用到的css提取出来
gulp.task('uncss', function () {
    return gulp.src('./test/bootstrap/bootstrap.css')
        .pipe(uncss({
            html: ['./test/index.html']
            // html: ['index.html', 'posts/**/*.html', 'http://example.com']
        }))
        .pipe(gulp.dest('./test/bootstrap/use'));
});

//直接复制过去，压缩打包正式上线时修改即可
gulp.task('zip', function(){
      function checkTime(i) {
          if (i < 10) {
              i = "0" + i
          }
          return i
      }
      var d=new Date();
      var year=d.getFullYear();
      var month=checkTime(d.getMonth() + 1);
      var day=checkTime(d.getDate());
      var hour=checkTime(d.getHours());
      var minute=checkTime(d.getMinutes());
  return gulp.src('./test/**')
        .pipe(zip( config.project+'-'+year+month+day +hour+minute+'.zip'))
        .pipe(gulp.dest('./app'));
});

//压缩与 jasmine 之类，在测试环境中不考虑
//压缩html
gulp.task('minihtml', function() {
   gulp.src('./test/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./app/'))
});
// 压缩 JS 
gulp.task('js', function() {
    gulp.src('./test/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./app'));
});
//压缩图片 -imagemin
gulp.task('imagemin', function () {
    return gulp.src('./test/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./app/images'));
});

//压缩图片 - tinypng(更小，更强)
gulp.task('tinypng', function () {
    gulp.src('./test/images/*.{png,jpg,jpeg}')
        .pipe(tinypng(config.tinypngapi))
        .pipe(gulp.dest('./app/images'));
});

//打包主体build 文件夹并按照时间重命名


var scsslint = require('gulp-scss-lint');
gulp.task('scsslint', function() {
  return gulp.src('./test/scss/*.scss')
    .pipe(scsslint());
});