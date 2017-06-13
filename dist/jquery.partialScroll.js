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
      sliderBefore: function () { return true; },
      sliderAfter: function () { return true; }
    }, opts);

    function init() {

      opts.secWidth = _el.css('width');
      opts.secHeight = _el.css('height');

      // console.log(_el.css('width'), _el.css('height'));

      _el.css({ overflow: 'hidden' });
      _el.wrapInner('<div class="' + AREA + '"></div>');
      _s.wrap = _el.find('.' + AREA);
      _s.wrap.css({
        width: opts.secWidth,
        position: 'relative'
      });

      _s.stopAllFunctions = false;
      _s.throttleWheel = false;
      _s.scrolling = false;
      _s.oldIndex = 0;
      _s.currentIndex = 0;
      _s.currentPositionTop = 0;
      _s.secLength = opts.secLength === 0 ? _el.find('.section').length : opts.secLength;
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
      if (_s.stopAllFunctions) return;

      if ( _s.scrolling
        || _s.currentIndex === 0 && secIndex === 'up'
        || _s.currentIndex === _s.secLength - 1 && secIndex === 'down'
        || _s.currentIndex === secIndex
      ) return;

      _s.scrolling = true;
      _s.oldIndex = _s.currentIndex;
      _s.secIndex = secIndex;

      switch (_s.secIndex) {
        case 'up':
          opts.sliderBefore(_s.oldIndex, _s.oldIndex - 1);
          _s.currentPositionTop = _s.currentPositionTop + parseInt(opts.secHeight);
          break;
        case 'down':
          opts.sliderBefore(_s.oldIndex, _s.oldIndex + 1);
          _s.currentPositionTop = _s.currentPositionTop - parseInt(opts.secHeight);
          break;
        default:
          if (typeof _s.secIndex  === 'number') {
            opts.sliderBefore(_s.oldIndex, _s.secIndex );
            _s.currentPositionTop = -(parseInt(opts.secHeight) * _s.secIndex );
          }
      }

      animateSection();
    }

    function animateSection() {
      _s.wrap.stop().animate({
        top: _s.currentPositionTop
      }, opts.scrollingSpeed, renewCurrentIndex);
    }

    function renewCurrentIndex() {
      switch (_s.secIndex) {
        case 'up':
          _s.currentIndex--;
          break;
        case 'down':
          _s.currentIndex++;
          break;
        default:
          if (typeof _s.secIndex  === 'number') {
            _s.currentIndex = _s.secIndex;
          }
      }

      setTimeout(function () {
        _s.scrolling = false;
      }, 400);

      opts.sliderAfter(_s.oldIndex, _s.currentIndex);
    }

    _el.moveTo = function (secIndex) {
      checkDirection(secIndex);
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