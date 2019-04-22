var htmlHref = window.location.href;
var index = htmlHref.lastIndexOf("=");
var str = htmlHref.substring(index + 1, htmlHref.length);
var code = '123';
var url = ['https://ypsuperkey.meek.com.cn/api/v1/items/BDY-' + str + '?client_version=2018.12&callback=?']
chrome.runtime.sendMessage(url, function (response) {                  //将抓取到的标题发送给background.js后台处理
  code = response[0].access_code;

});
$(document).ready(function () {
  $(".QKKaIE").val(code);
  $(".g-button-right").click();
})


