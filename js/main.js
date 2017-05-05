$(function () {

  var scroll1 = $('.partialscroll').partialScroll({
    sliderBefore: function (oldIndex, newIndex) {
      console.log('BEFORE - old: ' + oldIndex + ', new: ' + newIndex);
    },
    sliderAfter: function (oldIndex, newIndex) {
      console.log('AFTER - old: ' + oldIndex + ', new: ' + newIndex);
    }
  });

  $('.move_btn').on('click', function () {
    scroll1.moveTo(2);
  });

  // $('.new_partialscroll').partialScroll();

});