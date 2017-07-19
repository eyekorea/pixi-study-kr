 	function ratio( n1, n2 ){
		return ( n1 > n2 ) ? [ n1 / n2, 1 ] : [ 1, n2 / n1 ];
	};
	function imgSizeFnc ( imgWidth, imgHeight , areaWidth, areaHeight ){
	    var imgW = imgWidth,
	      imgH = imgHeight,
	      blockW = areaWidth,
	      blockH = areaHeight,
	      imgRatio = ratio ( imgW, imgH ),
	      blockRatio = ratio ( blockW, blockH );
	    var _class = (function(){
	      if( blockRatio[0] > blockRatio[1] ) { // 화면 가로 비율이 더 크다.
	        if( imgRatio[0] > imgRatio[1] ) { // 이미지도 가로 비율이 더 크다.
	          if ( blockRatio[0] > imgRatio[0] ) {
	            return 'imgW';
	          } else {
	            return 'imgH';
	          }
	        } else { // 이미지는 세로 비율이 더 크다
	          return 'imgW';
	        }
	      } else { // 화면 세로 비율이 더 크다.
	        if ( imgRatio[0] < imgRatio[1] ){ // 이미지도 세로 비율이 더 크다.
	          if( blockRatio[1] > imgRatio[1] ) {
	            return 'imgH';
	          } else {
	            return 'imgW';
	          }
	        } else {
	          return 'imgH'
	        }
	      }
	    })();
	   return _class;
  };