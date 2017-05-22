;(function ($) {
  'use strict';

  var AREA = 'partialscroll-area';

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
      scrollingSpeed: 700, // 섹션 속도
      throttleScrolling: 100, // 스크롤 체크 속도
      sliderBefore: function () { return true; },
      sliderAfter: function () { return true; }
    }, opts);

    function init() {

      opts.secWidth = _el.css('width');
      opts.secHeight = _el.css('height');

      console.log(_el.css('width'), _el.css('height'));

      _el.css({ overflow: 'hidden' });
      _el.wrapInner('<div class="' + AREA + '"></div>');
      _s.wrap = _el.find('.' + AREA);
      _s.wrap.css({
        width: opts.secWidth,
        position: 'relative'
      });

      _s.throttleWheel = false;
      _s.scrolling = false;
      _s.oldIndex = 0;
      _s.currentIndex = 0;
      _s.currentPositionTop = 0;
      _s.secLength = opts.secLength === 0 ? _el.find('.section').length : opts.secLength;

      initEvent();
    }

    function initEvent() {
      checkMouseWheel();
    }

    function checkMouseWheel() {

      _el.on('mousewheel DOMMouseScroll', function(e) {

        if (_s.throttleWheel) return;
        _s.throttleWheel = true;

        var event = e.originalEvent;
        var delta = 0;

        if (event.detail) delta = event.detail * -40; // FF
        else delta = event.wheelDelta; // CR, IE

        switch (delta) {
          case 120:
            _s.wheel = 'up';
            break;
          case -120:
            _s.wheel = 'down';
            break;
        }

        checkDirection(_s.wheel);

        setTimeout(function () {
          _s.throttleWheel = false;
        }, opts.throttleScrolling);
      });
    }

    function checkDirection(secIndex) {
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

      _s.scrolling = false;

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
      _s.throttleWheel = true;
    };

    _el.startScroll = function () {
      _s.throttleWheel = false;
    };

    init();

    return this;

  };

})(jQuery);