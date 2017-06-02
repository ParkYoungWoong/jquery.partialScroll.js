$(function () {

  var scroll1 = $('.container').partialScroll({
    footer: true,
    sliderBefore: function (oldIndex, newIndex) {
      console.log('BEFORE - old: ' + oldIndex + ', new: ' + newIndex);
    },
    sliderAfter: function (oldIndex, newIndex) {
      console.log('AFTER - old: ' + oldIndex + ', new: ' + newIndex);
    }
  });

  $('.move_to button').on('click', function () {
    var val = $(this).siblings('input').val();
    console.log(val);
    scroll1.moveTo(val);
  });

  $('.move_up').on('click', function () {
    scroll1.moveToUp();
  });

  $('.move_down').on('click', function () {
    scroll1.moveToDown();
  });

  $('.stop').on('click', function () {
    scroll1.stopScroll();
  });

  $('.start').on('click', function () {
    scroll1.startScroll();
  });

});


