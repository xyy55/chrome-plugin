(function () {
  window.onload = function () {
    // 删除在 APP 打开
    removeItem(document.querySelector('.OpenInAppButton'))
    // 判断必须是在知乎问题页面
    if (!document.URL.includes('www.zhihu.com/question')) {
      return
    }
    // 展开文章
    let nodeList = document.querySelectorAll(
      '.RichContent.is-collapsed.RichContent--unescapable'
    )
    nodeList.forEach(item => {
      item.innerHTML = item.querySelector('span').innerHTML
      item.setAttribute('class', item.getAttribute('class') + ' ztext')
    })

    // 加载全部图片（默认延迟加载）
    let spanList = document.querySelectorAll('figure > img')
    spanList.forEach(span => {
      let src = span.dataset.actualsrc
      span.src = src
    })
    //加载全部gif
    let gifList = document.querySelectorAll('.GifPlayer')
    gifList.forEach(gif => {
      let img_src = gif.querySelector('img').src.replace('jpg', 'gif');
      gif.addEventListener("click", function () {
        this.setAttribute("class", "GifPlayer isPlaying");
        this.querySelector('img').src = img_src;
      })
    })
    //加载全部电影
    let movieList = document.querySelectorAll('.RichText-video')
    if (movieList.length !== 0) {
      movieList.forEach(movie => {
        let video_id = JSON.parse(movie.dataset.zaExtraModule).card.content.video_id;
        let video_card = movie.querySelector(".VideoCard-player");
        video_card.insertAdjacentHTML("afterBegin", '<iframe frameborder="0" allowfullscreen="" src="https://www.zhihu.com/video/' + video_id + '?autoplay=false&useMSE="></iframe>')
      })
    }

    // 删除推荐
    removeItem(document.querySelector('.Card.RelatedReadings'))
    removeItem(document.querySelector('.Card.HotQuestions'))

  }

  function removeItem (item) {
    if (item == null) {
      return
    }
    let parent = item.parentElement

    parent.removeChild(item)
  }
})()