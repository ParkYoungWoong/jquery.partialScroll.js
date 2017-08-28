$(function () {

  var scroll1 = $('.container').partialScroll({
    footer: true,
    sliderBefore: function (oldIndex, newIndex) {
      // console.log('BEFORE - old: ' + oldIndex + ', new: ' + newIndex);
    },
    sliderAfter: function (oldIndex, newIndex) {
      // console.log('AFTER - old: ' + oldIndex + ', new: ' + newIndex);
    }
  });

  $('.move_to.normal_move_to button').on('click', function () {
    var val = $(this).siblings('input').val();
    scroll1.moveTo(val);
  });

  $('.move_to.silent_move_to button').on('click', function () {
    var val = $(this).siblings('input').val();
    scroll1.silentMoveTo(val);
  });

  $('.move_up').on('click', function () {
    scroll1.moveToUp();
  });

  $('.move_down').on('click', function () {
    scroll1.moveToDown();
  });

  $('.pause').on('click', function () {
    scroll1.stopScroll();
    $(this).css({ background: 'red' });
    $('.play').css({ background: 'black' });
  });

  $('.play').on('click', function () {
    scroll1.startScroll();
    $(this).css({ background: 'red' });
    $('.pause').css({ background: 'black' });
  });

});


