var gulp = require('gulp'); // 引入 gulp

var config     = require('./config.json'); //引入本地配置文件

// 引入组件
//karma/jasmines可进行单元测试，一年后使用。，先基础，还有Bower,yeoman,gulp-livereload 可以刷新服务器，

var jshint = require('gulp-jshint'),  //js检查
sass = require('gulp-sass'),      //
concat = require('gulp-concat'),   //合并文件
uglify = require('gulp-uglify'),     //压缩js文件
htmlmin = require('gulp-htmlmin'),   //压缩html
// cssmin  = require(''),               //压缩css
rename = require('gulp-rename'),     //重命名



webserver  = require('gulp-webserver'),  //建立本地服务器
opn        = require('opn'),            //opn 是打开浏览器的插件
livereload = require('gulp-livereload'),  //本地更改刷新服务器
imagemin   = require('gulp-imagemin'),    
pngquant   = require('imagemin-pngquant'),  //压缩图片的第一个插件
tinypng    = require('gulp-tinypng'),      //压缩图片2，国外的，更好用
zip        = require('gulp-zip'),         //给app打包，一般使用git


// 检查 js，Link任务会检查 js/ 目录下得js文件有没有报错或警告。
gulp.task('lint', function(cb) {
    gulp.src('./test/js/*.js')
        .pipe(jshint())   
        .pipe(jshint.reporter('default'));
    cb(err);
});

// 合并，压缩 JS 
// 中间加了lint,表示必须检查脚本之后运行
gulp.task('scripts',['lint'], function() {
    gulp.src('./test/js/*.js')
        .pipe(concat('all.js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/js'));
});

// 编译Sass，Sass任务会编译 scss/ 目录下的scss文件，并把编译完成的css文件保存到 /css 目录中。
gulp.task('sass', function() {
    gulp.src('./test/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        // .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./test/css'));
});



gulp.task('scss', () => {
  gulp
    .src('./test/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./test/who'))
    .pipe(refresh())
})
 
// gulp.task('watch', () => {
//   refresh.listen()
//   gulp.watch('./test/scss/*.scss', ['scss'])
// })
gulp.task('lmk',function(){
    gulp.run('webserver');
    gulp.watch('./test/scss/*.scss',function(){
        gulp.run('o');
    });
});



//开启本地 Web,用哪个时配置哪个，config是前面引入自己定义的json文件
//livereload 可以自动刷新浏览器
gulp.task('webserver', function(cb) {
  gulp.src( './' )
    .pipe(webserver({
      host:             "localhost",
      port:             "8081",
      livereload:       true,
      directoryListing: false
    }));
    cb();
});
//通过浏览器打开本地 Web服务器 路径
gulp.task('openbrowser',function() {
  opn( 'http://' + config.localserver.host + ':' + config.localserver.port );
});

//默认任务
gulp.task('o', function(){
  gulp.run('openbrowser');
});


// // 默认任务，使用 .run() 方法关联和运行我们上面定义的任务
// gulp.task('default', function(){
//     gulp.run('lint', 'sass', 'scripts');

//     // 监听文件变化
//     gulp.watch('./js/*.js', function(){
//         gulp.run('lint', 'sass', 'scripts');
//     });
//     gulp.watch('./scss/*.scss', function(){
//         gulp.run('lint', 'sass', 'scripts');
//     });

// });



//下面是后期考虑的

//压缩html
gulp.task('minihtml', function() {
   gulp.src('./test/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./app/'))
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
  return gulp.src('./build/**')
        .pipe(zip( config.project+'-'+year+month+day +hour+minute+'.zip'))
        .pipe(gulp.dest('./'));
});
