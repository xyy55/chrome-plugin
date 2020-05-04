$("img").click(function () {
  if ($(this).attr("src") !== "img/img.jpg") {
    $(this).attr("src", "img/img.jpg")
  } else {
    $(this).attr("src", "img/icon_128.png")
  }
})
$("input").click(() => {
  if ($("#integration").prop('checked') == true) {
    localStorage.setItem("integration", true);
  } else {
    localStorage.setItem("integration", false);
  }
})
let integration = localStorage.getItem("integration");
if (integration == "true") {
    $("#integration").prop('checked', true);
}
