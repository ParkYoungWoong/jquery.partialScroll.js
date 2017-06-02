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
      footer: false, // FOOTER 사용 유무
      sliderBefore: function () { return true; },
      sliderAfter: function () { return true; }
    }, opts);

    function init() {

      opts.secWidth = _el.css('width');
      opts.secHeight = _el.css('height');

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
      _s.moveValue = parseInt(opts.secHeight);

      initEvent();
    }

    function initEvent() {
      checkMouseWheel();
    }

    function checkMouseWheel() {

      _el.on('mousewheel DOMMouseScroll', function(e) {
        if (_s.stopAllFunctions) return;

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

    function renewCurrentIndex() {
      switch (_s.secIndex) {
        case 'up':  // 스크롤 올리기
          _s.currentIndex--;
          opts.sliderBefore(_s.oldIndex, _s.currentIndex);
          _s.moveValue = _el.find('.section').eq(_s.oldIndex).height();
          _s.currentPositionTop = _s.currentPositionTop + _s.moveValue;
          break;
        case 'down':  // 스크롤 내리기
          _s.currentIndex++;
          opts.sliderBefore(_s.oldIndex, _s.currentIndex);
          _s.moveValue = _el.find('.section').eq(_s.currentIndex).height();
          _s.currentPositionTop = _s.currentPositionTop - _s.moveValue;
          break;
        default:  // 섹션 번호 입력
          if (typeof _s.secIndex  === 'number') {
            _s.currentIndex = _s.secIndex;
            opts.sliderBefore(_s.oldIndex, _s.secIndex );

            var secIndex = 0;
            if (_s.secIndex === _s.secLength - 1) secIndex = _el.find('.section').eq(_s.currentIndex).height;
            _s.currentPositionTop = -(_s.moveValue * _s.secIndex + secIndex );
          }
      }
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

      renewCurrentIndex();
      animateSection();
    }

    function animateSection() {
      _s.wrap.stop().animate({
        top: _s.currentPositionTop
      }, opts.scrollingSpeed, completeAnimation);
    }

    function completeAnimation() {
      _s.scrolling = false;

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