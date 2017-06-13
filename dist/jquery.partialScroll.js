;(function ($) {
  'use strict';

  var AREA = 'partialscroll-area';
  var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  $.fn.partialScroll = function (opts) {

    if (this.length === 0) return this;

    if (this.length > 1) {
      this.each(function () {
        $(this).partialScroll(opts);
      });
      return this;
    }

    var _s = {};
    var _el = this;

    opts = $.extend({
      secWidth: 0, // 스크롤 영역의 가로 너비
      secHeight: 0, // 스크롤 영역의 세로 너비
      secLength: 0, // 섹션의 개수
      scrollingSpeed: 900, // 섹션 속도
      throttleScrolling: 100, // 스크롤 체크 속도
      footer: false, // FOOTER 사용 유무
      sliderBefore: function () { return true; },
      sliderAfter: function () { return true; }
    }, opts);

    function init() {
      _el.css({ overflow: 'hidden' });
      _el.wrapInner('<div class="' + AREA + '"></div>');

      _s.secWidth = opts.secWidth === 0 ? parseInt(_el.css('width')) : opts.secWidth;
      _s.secHeight = opts.secHeight === 0 ? parseInt(_el.css('height')) : opts.secHeight;
      _s.secLength = opts.secLength === 0 ? _el.find('.section').length : opts.secLength;

      _s.wrap = _el.find('.' + AREA);
      _s.wrap.css({
        width: _s.secWidth,
        position: 'relative'
      });

      _s.stopAllFunctions = false;
      _s.throttleWheel = false;
      _s.scrolling = false;
      _s.oldIndex = 0;
      _s.currentIndex = 0;
      _s.currentPositionTop = 0;
      _s.moveValue = parseInt(_s.secHeight);
      _s.newDate = new Date();
      _s.oldDate = null;

      initEvent();
    }

    function initEvent() {
      checkMouseWheel();
    }

    function checkBrowser(e) {
      var delta = null;
      var event = e.originalEvent;

      if (event.detail) {
        delta = event.detail * -40;  // FF
      } else {
        delta = event.wheelDelta;  // CR, IE
      }

      return delta;
    }

    function killBounce(wait, e) {
      if (!isMac) return;

      _s.oldDate = _s.newDate;
      _s.newDate = new Date();

      var timeLag = _s.newDate.getTime() - _s.oldDate.getTime();
      var delta = Math.abs(checkBrowser(e));

      console.log(delta);

      if (timeLag < wait && delta < 50) {
        return true;
      }
    }

    function checkMouseWheel() {
      _el.on('mousewheel DOMMouseScroll', function(e) {
        if (_s.stopAllFunctions
          || _s.throttleWheel
          || killBounce(150, e)
        ) return;

        _s.throttleWheel = true;

        var delta = checkBrowser(e);

        if (delta === 120 || delta > 0) {  // Normal || Mac
          _s.wheel = 'up';
        } else if (delta === -120 || delta < 0) {
          _s.wheel = 'down';
        }

        checkDirection(_s.wheel);

        setTimeout(function () {
          _s.throttleWheel = false;
        }, opts.throttleScrolling);
      });
    }

    function checkDirection(secIndex) {
      if ( _s.scrolling  // 스크롤 중일 때
        || _s.stopAllFunctions  // 모든 기능 정지하기일 때
        || _s.currentIndex === 0 && secIndex === 'up'  // 가장 상단일 때
        || _s.currentIndex === _s.secLength - 1 && secIndex === 'down'  // 가장 하단일 때
        || _s.currentIndex === secIndex  // 현재 섹션과 입력된 섹션이 같을 때
        || _s.secLength - 1 < secIndex  // 섹션의 개수보다 입력된 섹션이 클 때
      ) return;

      _s.scrolling = true;
      _s.oldIndex = _s.currentIndex;
      _s.secIndex = secIndex;

      renewCurrentIndex();
      animationBefore();
      animationFooter();
      animateSection();
    }

    function animationFooter() {
      switch (_s.secIndex) {
        case 'up':  // 스크롤 올리기
          _s.moveValue = _el.find('.section').eq(_s.oldIndex).height();
          _s.currentPositionTop = _s.currentPositionTop + _s.moveValue;
          break;
        case 'down':  // 스크롤 내리기
          _s.moveValue = _el.find('.section').eq(_s.currentIndex).height();
          _s.currentPositionTop = _s.currentPositionTop - _s.moveValue;
          break;
        default:  // 섹션 번호 입력
          if (typeof _s.secIndex  === 'number') {
            _s.moveValue = _el.find('.section').eq(_s.currentIndex).height();
            var secIndex = 0;
            if (_s.secIndex === _s.secLength - 1) secIndex = _el.find('.section').eq(_s.currentIndex).height() - _s.secHeight;
            _s.currentPositionTop = -(_s.secHeight * _s.secIndex + secIndex );
          }
      }
    }

    function renewCurrentIndex() {
      switch (_s.secIndex) {
        case 'up':  // 스크롤 올리기
          _s.currentIndex--;
          break;
        case 'down':  // 스크롤 내리기
          _s.currentIndex++;
          break;
        default:  // 섹션 번호 입력
          if (typeof _s.secIndex  === 'number') {
            _s.currentIndex = _s.secIndex;
          }
      }
    }

    function animateSection() {
      _s.wrap.stop().animate({
        top: _s.currentPositionTop
      }, opts.scrollingSpeed, animationAfter);
    }

    function animationBefore() {
      switch (_s.secIndex) {
        case 'up':  // 스크롤 올리기
          opts.sliderBefore(_s.oldIndex, _s.currentIndex);
          break;
        case 'down':  // 스크롤 내리기
          opts.sliderBefore(_s.oldIndex, _s.currentIndex);
          break;
        default:  // 섹션 번호 입력
          if (typeof _s.secIndex  === 'number') {
            opts.sliderBefore(_s.oldIndex, _s.secIndex );
          }
      }
    }

    function animationAfter() {
      setTimeout(function () {
        _s.scrolling = false;
      }, 400);

      opts.sliderAfter(_s.oldIndex, _s.currentIndex);
    }

    _el.moveTo = function (secIndex) {
      checkDirection( Number(secIndex) );
    };

    _el.moveToUp = function () {
      checkDirection('up');
    };

    _el.moveToDown = function () {
      checkDirection('down');
    };

    _el.stopScroll = function () {
      _s.stopAllFunctions = true;
    };

    _el.startScroll = function () {
      _s.stopAllFunctions = false;
    };

    init();

    return this;

  };

})(jQuery);