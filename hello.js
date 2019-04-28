$("img").click(function () {
  if ($(this).attr("src") !== "img/img.jpg") {
    $(this).attr("src", "img/img.jpg")
  } else {
    $(this).attr("src", "img/icon_128.png")
  }

})