let htmlHref = window.location.href;
let url = htmlHref
// let share_code = /.+surl=([a-zA-Z0-9_\-]+)&?/gi.exec(htmlHref)
// let url = ['https://ypsuperkey.meek.com.cn/api/v1/items/BDY-' + share_code[1] + '?client_version=2018.12&callback=?']

let code = '';
chrome.runtime.sendMessage(url, function (response) {                  //将抓取到的标题发送给background.js后台处理
  code = response;
});
$(document).ready(function () {
  if (htmlHref.indexOf("wap") === -1) {
    $(".QKKaIE").val(code);
    $(".g-button-right").click();
  } else {
    // 创建
    let input_event = document.createEvent('HTMLEvents');
    // 初始化，事件类型，是否冒泡，是否阻止浏览器的默认行为
    input_event.initEvent("input", false, false);
    $("input").val(code);
    //激活
    document.querySelector('input').dispatchEvent(input_event);
    $('.m-button').click();
  }

})


