(function () {
  if (document.querySelectorAll('.g-button').length <= 0) {
    return 0
  }
  let download_button = document.querySelectorAll('.g-button')[1]
  let title = download_button.querySelector(".text").innerHTML
  let download = document.createElement('a')
  let link = location.href
  link = link.replace('baidu.com', 'baiduwp.com')
  let text = '<a class="g-button" href="' + link + '" title="跳转PanDownload下载"><span class="g-button-right"><em class="icon icon-download" title="跳转PanDownload下载"></em><span class="text" style="width: auto;">' + title + '</span></span></a>'
  download_button.remove()
  document.querySelector('.x-button-box').insertAdjacentHTML('afterbegin', text);
})();


