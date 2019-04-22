function start () {
  if ($("body > div:contains('pan.baidu.com')").length == 0) {
    console("true")
    return
  }
  let valid_img = '<img src="data:image/png;base64,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" style="display:inline-block;width:14px;margin:0 5px 2px 0;vertical-align:middle;" title="火火火三大">'
  let invalid_img = '<img src="data:image/png;base64,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" style="display:inline-block;width:14px;margin:0 5px 2px 0;vertical-align:middle;" title="火火火三大">'
  $("body > div:contains('pan.baidu.com')").each(
    function () {
      $(this).find("a").each(function () {
        let e = $(this)[0].outerHTML;
        $(this)[0].outerHTML = e.replace(/pan\.baidu\.com/gi, "####BDY####")
      });
      $(this).find("textarea").each(function () {
        let e = $(this)[0].outerHTML;
        $(this)[0].outerHTML = e.replace(/pan\.baidu\.com/gi, "####BDY####")
      });
      let text = repalce_link($(this)[0].outerHTML, /([ ])(s\/1[a-zA-Z0-9_\-]{5,22})/g, 1)
      text = repalce_link(text, /([ ])(\/s\/1[a-zA-Z0-9_\-]{5,22})/g, 2)
      text = repalce_link(text, /https?:\/\/pan\.baidu\.com\/s\/1[a-zA-Z0-9_\-]{5,22}/gi, 3)
      text = repalce_link(text, /pan\.baidu\.com\/s\/1[a-zA-Z0-9_\-]{5,22}/gi, 4)
      $(this)[0].outerHTML = text
    }
  )
  function repalce_link (text, patten, type) {
    let links = text.match(patten)
    if (links == null) {
      return text
    }
    switch (type) {
      case 1:
        for (let i = 0; i < links.length; i++) {
          text = text.replace(new RegExp(links[i], 'gi'), '<a href="https://####BDY####/' + links[i].substr(1) + '" target="_blank" rel="nofollow">' + links[i] + '</a>')
        }
        break;
      case 2:
        for (let i = 0; i < links.length; i++) {
          text = text.replace(new RegExp(links[i], 'gi'), '<a href="https://####BDY####' + links[i].substr(1) + '" target="_blank" rel="nofollow">' + links[i] + '</a>')
        }
        break;
      case 3:
        for (let i = 0; i < links.length; i++) {
          let link = links[i].replace(/pan\.baidu\.com/gi, "####BDY####")
          text = text.replace(new RegExp(links[i], 'gi'), '<a href="' + link + '" target="_blank" rel="nofollow">' + link + '</a>')
        }
        break;
      case 4:
        for (let i = 0; i < links.length; i++) {
          let link = links[i].replace(/pan\.baidu\.com/gi, "####BDY####")
          text = text.replace(new RegExp(links[i], 'gi'), '<a href="https://' + link + '" target="_blank" rel="nofollow">' + link + '</a>')
        }
        break;
    }

    return text
  }
  let share_code = []
  $("body").each(function () {
    $(this).find("a").each(function () {
      let code = $(this).html().match(/s\/1([a-zA-Z0-9_\-]{5,22})/gi)
      if (code != null && share_code.indexOf(code[0]) == -1) {
        share_code.push(code[0])
      }
    })
  })
  let e = $("body").html()
  $("body").html(e.replace(/####BDY####/g, "pan.baidu.com"))
  let urls = []
  for (var i = 0; i < share_code.length; i++) {
    let code = /1(.+)/gi.exec(share_code[i])[1]
    urls.push("http://ypsuperkey.meek.com.cn/api/items/BDY-" + code + "?access_key=4fxNbkKKJX2pAm3b8AEu2zT5d2MbqGbD&client_version=web-client")
  };
  chrome.runtime.sendMessage(urls, function (response) {
    for (let i = 0; i < response.length; i++) {
      if (response[i].state == "VALID") {
        $("a").each(function () {
          let valid_link = $(this).html().match(new RegExp(share_code[i], 'gi'))
          if (valid_link != null) {
            $(this).css("text-decoration", "underline")
            $(this).html(valid_img + $(this).html())
          }
        })
      } else {
        $("a").each(function () {
          let valid_link = $(this).html().match(new RegExp(share_code[i], 'gi'))
          if (valid_link != null) {
            $(this).css("text-decoration", "line-through")
            $(this).html(invalid_img + $(this).html())
          }
        })
      }
    }
  });
}
start()






