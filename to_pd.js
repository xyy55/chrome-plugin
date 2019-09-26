(function () {
  if (document.querySelectorAll('.download-btn').length <= 0) {
    return 0
  }
  let download_button = document.querySelector('.download-btn');
  let link = location.href;
  link = link.replace('baidu.com', 'baiduwp.com')
  let text = '<a class="download-btn" href="' + link + '" title="跳转PanDownload下载" style="display: inline-block;width: 50px;height: 50px;line-height: 50px;padding: 0;line-height: 42px;background-color: #F9F9F9;color: #06A7FF;border-radius: 50%;margin: 0 auto;font-size: 14px;text-align: center;vertical-align: top;font-weight: 700;"><span class="wapfont icon-download"></span></a>'
  download_button.remove()
  document.querySelector('.button-group').insertAdjacentHTML('afterbegin', text);
})();