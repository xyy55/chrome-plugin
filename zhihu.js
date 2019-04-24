$("body > div:contains('pan.baidu.com')").each(function () {
  $(this).find("a").each(function () {
    let e = $(this)[0].outerHTML;
    $(this)[0].outerHTML = e.replace(/pan\.baidu\.com/gi, "####BDY####")
  });
  $(this).find("pan.baidu.com").each(function () {
    console.log($(this).html())
  })
})