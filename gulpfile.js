'use strict';

// Promise 지원하지 않는 Node.js 버전을 위한 Promise polyfill
require('es6-promise').polyfill();

// Gulp
var gulp = require('gulp');

// gulp-* 패키지들을 require() 해서 변수에 넣어줌
// Gulp 플러그인들을 일일이 require() 하지 않아도 됨
// 플러그인 이름이 gulp-abc-def이면 $.abcDef로 호출할 수 있음
var $ = require('gulp-load-plugins')();

// gulp-* 패키지가 아닌 패키지들은 직접 require() 해주어야 함

// Browsersync: http://browsersync.io/
// 로컬 서버 및 파일 수정 시 자동 새로고침
// 패키지 require() 후 바로 Browsersync 객체 생성
var bs = require('browser-sync').create();
// var babel = require('gulp-babel');

// gulp.spritesmith
var spritesmith = require('gulp.spritesmith-multi');



// =============================================================================
// Clean
// =============================================================================

// 빌드 후 생성된 build 디렉토리를 삭제
// build 디렉토리를 삭제하지 않으면 src 디렉토리에서 삭제한 파일의 내용이 남아있게
// 되므로 새로 빌드를 하기 전에 기존에 생성된 내용은 삭제해주는 것이 좋음

gulp.task('clean', function (cb) {
	var del = require('del');
	del('build/').then(function () {
		cb();
	});
});


// =============================================================================
// Markup
// =============================================================================

// HTMLHint 검사
// HTML 인클루드

gulp.task('markup', function () {
	return gulp.src([
		'src/**/*.html',
		'!src/modify/*.html'
		])
		// gulp-plumber: 작업 중 오류가 발생했을 때 오류 메시지 처리를 해줌
		.pipe($.plumber())
		// gulp-newer: build/ 디렉토리에 생성되어 있는 HTML 파일보다 새로운
		// 파일이면 이하 작업 수행. 아니면 테스크 중단.
		.pipe($.newer('build/'))
		// gulp-lb-include: HTML 인클루드
		// src 디렉토리를 인클루드의 루트 경로로 설정
		// 따라서 src/path/to/include/partial.html 파일을 인클루드 하려면
		// <!--#include file="/path/to/include/partial.html" -->
		.pipe($.lbInclude({
			root: 'src/'
			// root: 'src/',
			// varDefaults: {
			// 	'$category': 'fashion',
			// 	'$navIs': ''
			// }
		}))
		// gulp-ignore: 이하 `_`로 시작하는 디렉토리 내부의 HTML 파일은 무시
		.pipe($.ignore.exclude([
			'**/_*/**/*',
			'**/_*'
		]))
		// gulp-jsbeautifier: 인클루드 시 들여쓰기가 틀어지므로 다시 정리
		.pipe($.jsbeautifier({
			indentWithTabs: true, // 탭으로 들여쓰기
			endWithNewLine: true, // 파일 마지막에 빈 줄 추가
			preserveNewLines: true, // 빈 줄 삭제 않기
			maxPreserveNewLines: 5, // 삭제하지 않고 유지할 빈 줄의 크기
			indentInnerHtml: true, // <head>, <body> 태그 내부 들여쓰기
			braceStyle: 'expand' // 대괄호({}) 처리 방식
		}))
		// gulp-htmlhint: HTMLHint 검사
		// .htmlhintrc 파일에 검사할 규칙을 JSON 형식으로 작성
		// HTMLHint 규칙: https://github.com/yaniswang/HTMLHint/wiki/Rules
		.pipe($.htmlhint({
			htmlhintrc: '.htmlhintrc'
		}))
		// HTMLHint로 검사한 내용을 콘솔에 노출
		.pipe($.htmlhint.reporter())
		// build/ 디렉토리에 파일 생성
		.pipe(gulp.dest('build/'))
		// Browsersync 객체가 활성 상태이면 수정된 파일 새로 고침
		.pipe($.if(bs.active, bs.stream({
			// 스트림 당 한번만 새로 고침
			once: true
		})));
});


// =============================================================================
// Style
// =============================================================================

// Less, CSS Lint, Autoprefixer

function style(){
	gulp.src([
			'src/**/*.less',
			'!src/**/_*.less'
		])
	// gulp-plumber: 작업 중 오류가 발생했을 때 오류 메시지 처리를 해줌
	.pipe($.plumber())
	// gulp-newer: build/ 디렉토리에 생성되어 있는 CSS 파일보다 새로운
	// 파일이면 이하 작업 수행. 아니면 테스크 중단.
	.pipe($.newer('build/'))
	// gulp-less: Less 프리프로세서 처리
	.pipe($.less())
	// gulp-ignore: 이하 작업에는 _*.less로 인해 생성된 _*.css 파일들 제외
	.pipe($.ignore.exclude('**/_*'))
	// gulp-csslint: CSS Lint 검사
	// .csslintrc 파일에 검사할 규칙을 JSON 형식으로 작성
	// CSS Lint 규칙: https://github.com/CSSLint/csslint/wiki/Rules
	.pipe($.csslint({
		csslint: '.csslintrc'
	}))
	// CSS Lint로 검사한 내용을 콘솔에 노출
	.pipe($.csslint.reporter())
	// gulp-autoprefixer: http://caniuse.com의 데이터를 기반으로 자동으로
	// vender prefix 처리
	.pipe($.autoprefixer({
		// Autoprefixer 옵션
		// https://github.com/postcss/autoprefixer#options
		// 타겟 브라우저 지정: https://github.com/ai/browserslist#queries
		browsers: [
			'> 1%',
			'last 2 versions',
			'not ie <= 8'
		],
		// 생성되는 CSS의 규칙별 들여쓰기 여부
		cascade: false
	}))
	// build/ 디렉토리에 파일 생성
	.pipe(gulp.dest('build/'))
	// Browsersync 객체가 활성 상태이면 수정된 파일 새로 고침
	.pipe($.if(bs.active, bs.stream()));
}

gulp.task('style-only',function(){
	return style();
});

gulp.task('style',["sprite"], function () {
	return style();
});


// =============================================================================
// Script
// =============================================================================

// ESLint로 코드 검사, JS 파일 인클루드
gulp.task('script', function () {
	return gulp.src([
		'src/**/*.js',
		'!src/**/_*/*.js',
		'!src/**/_*'
	])
	// gulp-plumber: 작업 중 오류가 발생했을 때 오류 메시지 처리를 해줌
	.pipe($.plumber())
	// babel ( es 2015)
	// .pipe($.babel({
 //            presets: ['es2015','stage-2']
 //        }))
	// gulp-eslint: ESLint로 JS 파일 검사
	// 검사 규칙은 .eslintrc 파일에 JSON 형식으로 작성
	// ESLint 규칙: http://eslint.org/docs/rules/
	// .pipe($.eslint())
	// .pipe($.eslint.format())
	// .pipe($.eslint.failOnError())
	
	// gulp-nwayo-include:
	// JS 파일에서 다음과 같은 주석으로 다른 JS 파일의 내용을 삽입할 수 있음
	// //= require relative/path/to/file.js
	.pipe($.nwayoInclude())
	
	// build/ 디렉토리에 파일 생성
	.pipe(gulp.dest('build/'))
	// Browsersync 객체가 활성 상태이면 수정된 파일 새로 고침
	.pipe($.if(bs.active, bs.stream()));

});


// =============================================================================
// sprity
// =============================================================================

// sprite image 생성 ( 일반 dpi 만 지원 하는 이미지 스프라이트 )

gulp.task("sprite", function(){
	return gulp.src('src/assets/images/_sprite/**/*.png')
		.pipe($.plumber())
		.pipe(spritesmith({
			spritesmith: function (options, sprite, icons) {
				options.cssName = '_sprite-' + sprite + '.less';
				options.cssSpritesheetName = 'spr-' + sprite;
				options.cssTemplate = 'src/assets/images/_sprite/template.hbs';
				options.padding = 10;
				options.imgPath = '/assets/images/sprite/' + options.imgName;
				options.cssHandlebarsHelpers = {
					returnpx: function (num) {
						//return num + 'px';
						return Math.round(num/2) + 'px';
					}
				}
			}
		}))
		.pipe($.if('*.png', gulp.dest('build/assets/images/sprite/'), gulp.dest('src/assets/css/')))
		.pipe($.if(bs.active, bs.stream()));
});



// =============================================================================
// Image
// =============================================================================

// 이미지 최적화

gulp.task('image', function () {
	return gulp.src([
			'src/**/images/**/*.{png,jpg,jpeg,gif}',
			'!src/**/_*/**/*',
			'!src/**/_*'
		])
		.pipe($.plumber())
		.pipe($.newer('build/'))
		.pipe($.imagemin({
			interlaced: true,
			progressive: true
		}))
		.pipe(gulp.dest('build/'))
		.pipe($.if(bs.active, bs.stream()));
});


// =============================================================================
// Copy
// =============================================================================

// 기타 파일 build 디렉토리로 복사

gulp.task('copy', function () {
	return gulp.src([
			'src/**/*',
			'!src/**/_*/**/*',
			'!src/**/_*',
			'!src/**/*.html',
			'!src/**/*.less',
			'!src/**/*.js',
			'!src/**/*.psd',
			'!src/**/img/**/*.{png,jpg,jpeg,gif}'
		])
		.pipe($.newer('build/'))
		.pipe(gulp.dest('build/'))
		.pipe($.if(bs.active, bs.stream({
			once: true
		})));
});

// =============================================================================
// guide & modify Copy
// =============================================================================

// 기타 파일 build 디렉토리로 복사

gulp.task('copyToModify', function () {
	return gulp.src([
			'src/modify/*'
		])
		.pipe($.newer('build/'))
		.pipe(gulp.dest('build/modify/'))
		.pipe($.if(bs.active, bs.stream({
			once: true
		})));
});

// =============================================================================
// Build
// =============================================================================

// 위의 테스크들 모두 수행

gulp.task('build', function (cb) {
	var runSequence = require('run-sequence');

	runSequence('clean', [
		'markup',
		'image',
		'copyToModify',
		'style',
		'script',
		'copy'
	], cb);
});


// =============================================================================
// Watch
// =============================================================================

// 파일이 수정되면 수정된 내용을 바로 반영할 수 있도록 파일을 감시함

gulp.task('watch', ['build'], function () {
	// HTML 파일 수정 시 markup 테스크 수행
	gulp.watch('src/**/*.html', ['markup']);
	
	// sprite 이미지 추가시 sprite 테스크 수행.
	// gulp.watch('src/assets/images/_sprite.dpi2/*/*.png', ['sprity:dpi2']);
	// gulp.watch('src/assets/images/_sprite.normal/*/*.png', ['sprite']);

	gulp.watch([
		'src/**/*.less'
	],['style-only']);

	// Less 파일 수정 시 style 테스크 수행
	gulp.watch([
		'src/assets/images/_sprite/*/*.png'
	], ['style']);

	// Script 파일 수정 시 script 테스크 수행
	gulp.watch('src/**/*.js', ['script']);
	
	// 이미지 파일 수정 시 image 테스크 수행
	gulp.watch('src/**/*.{png,jpg,jpeg,gif}', ['image']);
	// 기타 파일 수정 시 copy 테스크 수행
	gulp.watch([
		'src/**/*',
		'!src/**/_*',
		'!src/**/*.html',
		'!src/**/*.less',
		'!src/**/*.js',
		'!src/**/*.psd',
		'!src/**/img/**/*.{png,jpg,jpeg,gif}'
	], ['copy']);
});


// =============================================================================
// Serve
// =============================================================================

// Browsersync를 사용하여 로컬 서버 구동

gulp.task('serve', ['watch'], function () {
	// Browsersync 객체 활성화
	bs.init({
		server: {
			// 서버를 통해 제공할 파일들이 있는 디렉토리
			baseDir: 'build/',
			// 브라우저로 디렉토리 접근 시 디렉토리 내 파일 노출 여부
			directory: true
		},
		// 서버 활성화 후 자동으로 브라우저 실행 시 접근할 경로
		startPath: '/',
		ghostMode: false
	});
});


// =============================================================================
// Default
// =============================================================================

// gulp 실행 시 수행될 기본 테스크

gulp.task('default', ['serve']);
