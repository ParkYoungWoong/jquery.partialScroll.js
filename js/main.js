$(function () {

  var scroll1 = $('.partialscroll').partialScroll({
    sliderBefore: function (oldIndex, newIndex) {
      console.log('BEFORE - old: ' + oldIndex + ', new: ' + newIndex);
    },
    sliderAfter: function (oldIndex, newIndex) {
      console.log('AFTER - old: ' + oldIndex + ', new: ' + newIndex);
    }
  });

  $('.move_to').on('click', function () {
    scroll1.moveTo(2);
  });

  $('.move_up').on('click', function () {
    scroll1.moveToUp();
  });

  $('.move_down').on('click', function () {
    scroll1.moveToDown();
  });

});


