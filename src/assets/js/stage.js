(function(){
  'use strict';
  var stageFrame = 0;
  // handle multiple browsers for requestAnimationFrame()
  window.requestAFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      // if all else fails, use setTimeout
      function (callback) {
        return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
      };
  })();

  // handle multiple browsers for cancelAnimationFrame()
  window.cancelAFrame = (function () {
    return window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      function (id) {
        window.clearTimeout(id);
      };
  })();

  var stage = {
    rate : 1,
    background: '#fff',
    isPlay : false,
    interval : null,
    sceneLen : 0,
    frame : function() {
      return stageFrame;
    },
    render : function(){
      stage.enterFrame();
      stage.interval = window.requestAFrame( stage.render );
    },
    play : function(){
      if( !stage.isPlay ){
         stage.render();
         stage.isPlay = true;
      }
    },
    stop : function(){
      if( stage.isPlay ) {
        window.cancelAFrame( this.interval );
        stage.interval = null;
        stage.isPlay = null;
        stageFrame = 0;
      }
    },
    pause : function(){
      if( stage.isPlay ) {
        window.cancelAFrame( stage.interval );
        stage.interval = null;
        stage.isPlay = null;
      }
    },
    enterFrame : function(){
      var i = 0;
      for( i; stage.sceneLen > i; i++ ){
        if( typeof stage.scene[i].draw === 'function' && stage.scene[i].status === 'play' ) {
          stage.scene[i].draw();
          stage.scene[i].movieClip.frame ++;
        }
      }
      stageFrame ++;
    },
    addScene : function ( obj ) {
      if( typeof obj === 'object'){
        stage.scene.push( obj );
        stage.sceneLen ++;
      }
    },
    removeScene : function ( index ){
      if( typeof stage.scene[index] === 'object' ) {
        stage.scene.splice( index, 1 );
        stage.sceneLen --;  
      }
    },
    scene : []
  };

    'use strict';
  function canvas ( ID, options ){
    var opt = {
      rate : 1000 / 60
    };
    this.element = document.getElementById(ID);
    this.context = this.element.getContext('2d');
    this.isStart = false;
    this.frame = 0;
    this.objs = [];
    
  };
  canvas.prototype.enterFrame = function( movieFnc ){
    var movie = ( typeof movieFnc === 'function' ) ? movieFnc : null;
    var instance = this;
    if( movie !== null ) {
      this.scene = {
        draw : movie,
        status : 'play',
        movieClip : instance
      };
      stage.addScene( this.scene );
    }
    if( !stage.isPlay ) {
      stage.play();
    }
  };

  canvas.prototype.play = function( context ){
    this.scene.status = 'play';
  };
  canvas.prototype.pause = function( context ){
    this.scene.status = 'pause';
  };
  canvas.prototype.stop = function( context ){
    this.scene.status = 'stop';
  };

  window._canvas = canvas;
  window._stage = stage;
})();
