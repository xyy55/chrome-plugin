let htmlHref = window.location.href;
let share_code = /.+surl=([a-zA-Z0-9_\-]+)&?/gi.exec(htmlHref)
let url = ['https://ypsuperkey.meek.com.cn/api/v1/items/BDY-' + share_code[1] + '?client_version=2018.12&callback=?']
chrome.runtime.sendMessage(url, function (response) {                  //将抓取到的标题发送给background.js后台处理
  code = response[0].access_code;

});
$(document).ready(function () {
  if (htmlHref.indexOf("wap") === -1) {
    $(".QKKaIE").val(code);
    $(".g-button-right").click();
  } else {
    $(".access-code").val(code);
    let valid_click = '<span id="valid_click"><span>';
    $("#getfileBtn").append(valid_click);
    $("#valid_click").click()
  }

})


