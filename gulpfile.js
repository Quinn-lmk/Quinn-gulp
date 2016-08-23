var gulp       = require('gulp'),           // 引入 gulp
    config     = require('./config.json'),  //引入本地配置文件
    jshint     = require('gulp-jshint'),    //js检查
    sass       = require('gulp-sass'),      
    htmlmin    = require('gulp-htmlmin'),   //压缩html
    rename     = require('gulp-rename'),    //重命名
    webserver  = require('gulp-webserver'), //建立本地服务器
    opn        = require('opn'),            //opn 是打开浏览器的插件
    livereload = require('gulp-livereload');//本地更改刷新服务器


// 检查 js，有没有报错或警告。
gulp.task('lint', function(cb) {
    gulp.src('./test/js/*.js')
        .pipe(jshint())   
        .pipe(jshint.reporter('default'));
    cb();
});
// 编译Sass。
gulp.task('sass', function() {
    gulp.src('./test/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        // .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./test/css'));
});

//开启本地 Web,livereload 可以自动刷新浏览器(chrome 下载)
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
//通过浏览器打开，地址在config配置
gulp.task('openbrowser',function() {
  opn( 'http://' + config.localserver.host + ':' + config.localserver.port +"/" + config.testHtmlAddress);
});

//一但修改就在配置的网页中刷新
gulp.task('default',function(){
    gulp.run('webserver'); //开启服务器
    gulp.watch(['./test/scss/*.scss','./test/*.html','./test/js/*.js'],function(){
        //打开服务器前先检查js,编译css
        gulp.run('openbrowser',['lint','sass'],function(){
            console.log('========success========')
        }); 
    });
});




