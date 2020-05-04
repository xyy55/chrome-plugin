const defaultRPC = '[{"name":"ARIA2 RPC","url":"http://localhost:6800/jsonrpc"}]';
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  let xhr = new XMLHttpRequest();
  let data = []
  for (let i = 0; i < request.length; i++) {
    xhr.open("GET", request[i], false);
    xhr.send();
    data.push(JSON.parse(xhr.responseText));
  }
  callback(data)
  return true;
});
let HttpSendRead = function(info) {
    Promise.prototype.done = Promise.prototype.then;
    Promise.prototype.fail = Promise.prototype.catch;
    return new Promise(function(resolve, reject) {
        let http = new XMLHttpRequest();
        let contentType = "application/x-www-form-urlencoded; charset=UTF-8";
        let timeout = 3000;
        if (info.contentType != null) {
            contentType = info.contentType;
        }
        if (info.timeout != null) {
            timeout = info.timeout;
        }
        let timeId = setTimeout(httpclose, timeout);
        function httpclose() {
            http.abort();
        }
        http.onreadystatechange = function() {
            if (http.readyState == 4) {
                if ((http.status == 200 && http.status < 300) || http.status == 304) {
                    clearTimeout(timeId);
                    if (info.dataType == "json") {
                        resolve(JSON.parse(http.responseText), http.status, http);
                    } else if (info.dataType == "SCRIPT") {
                        // eval(http.responseText);
                        resolve(http.responseText, http.status, http);
                    }
                } else {
                    clearTimeout(timeId);
                    reject(http, http.statusText, http.status);
                }
            }
        }
        http.open(info.type, info.url, true);
        http.setRequestHeader("Content-type", contentType);
        for (h in info.headers) {
            if (info.headers[h]) {
                http.setRequestHeader(h, info.headers[h]);
            }
        }
        if (info.type == "POST") {
            http.send(info.data);
        } else {
            http.send();
        }
    }
    );
};
//弹出chrome通知
function showNotification(id, opt) {
    let notification = chrome.notifications.create(id, opt, function(notifyId) {
        return notifyId
    });
}
//解析RPC地址
function parse_url(url) {
    let auth_str = request_auth(url);
    let auth = null;
    if (auth_str) {
        if (auth_str.indexOf('token:') == 0) {
            auth = auth_str;
        } else {
            auth = "Basic " + btoa(auth_str);
        }
    }
    let url_path = remove_auth(url);
    function request_auth(url) {
        return url.match(/^(?:(?![^:@]+:[^:@\/]*@)[^:\/?#.]+:)?(?:\/\/)?(?:([^:@]*(?::[^:@]*)?)?@)?/)[1];
    }
    function remove_auth(url) {
        return url.replace(/^((?![^:@]+:[^:@\/]*@)[^:\/?#.]+:)?(\/\/)?(?:(?:[^:@]*(?::[^:@]*)?)?@)?(.*)/, '$1$2$3');
    }
    return [url_path, auth];
}
function aria2Send(link, rpcUrl, downloadItem) {
    let filename = null;
    let referrer = null;
    let cookiesLink = null;
    if (downloadItem != null) {
        filename = downloadItem.filename;
        referrer = downloadItem.referrer;
        cookiesLink = downloadItem.url;
    } else {
        cookiesLink = link;
    }

    chrome.cookies.getAll({
        "url": cookiesLink
    }, function(cookies) {
        let format_cookies = [];
        console.log(cookies)
        for (let i in cookies) {
            let cookie = cookies[i];
            format_cookies.push(cookie.name + "=" + cookie.value);
        }
        let header = [];
        header.push("Cookie: " + format_cookies.join("; "));
        header.push("User-Agent: " + navigator.userAgent);
        header.push("Connection: keep-alive");
  
        let rpc_data = {
            "jsonrpc": "2.0",
            "method": "aria2.addUri",
            "id": new Date().getTime(),
            "params": [[link], {
                "header": header,
                "referer": referrer,
                "out": filename
            }]
        };
        let result = parse_url(rpcUrl);
        let auth = result[1];
        if (auth && auth.indexOf('token:') == 0) {
            rpc_data.params.unshift(auth);
        }
  
        let parameter = {
            'url': result[0],
            'dataType': 'json',
            type: 'POST',
            data: JSON.stringify(rpc_data),
            'headers': {
                'Authorization': auth
            }
        };
        console.log(parameter)
        HttpSendRead(parameter).done(function(json, textStatus, jqXHR) {
            let title = "导出成功";
            let des = "\nAria2已经开始任务下载。";
            let opt = {
                type: "basic",
                title: title,
                message: des,
                iconUrl: "img/icon_128.png",
                isClickable: true
            }
            let id = new Date().getTime().toString();
            showNotification(id, opt);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            let title = "导出失败";
            let des = "\n无法连接到Aria2c,导出下载任务失败!";
            let opt = {
                type: "basic",
                title: title,
                message: des,
                iconUrl: "img/icon_128.png",
                requireInteraction: false
            }
            let id = new Date().getTime().toString();
            showNotification(id, opt);
        });
    });
  
}
function enableCapture() {
  chrome.downloads.onDeterminingFilename.addListener(captureDownload);
}

function disableCapture() {
  if (chrome.downloads.onDeterminingFilename.hasListener(captureDownload)) {
      chrome.downloads.onDeterminingFilename.removeListener(captureDownload);
  }
}
function captureDownload(downloadItem, suggestion) {
  let integration = localStorage.getItem("integration");
  if (downloadItem.byExtensionId == "gbdinbbamaniaidalikeiclecfbpgphh") {
    //workaround for filename ignorant assigned by extension "音视频下载"
    return true;
  }
  if (integration == "true") {
    let rpc_list = JSON.parse(defaultRPC);
    chrome.downloads.cancel(downloadItem.id);
    console.log(downloadItem)
    aria2Send(downloadItem.url, rpc_list[0]['url'], downloadItem);
  }
}
window.addEventListener('storage', function(se) {
  //console.log(se);
  if (se.key == "integration") {
      if (se.newValue == "true") {
          enableCapture();
      } else if (se.newValue == "false") {
          disableCapture();
      }
  }
});
let integration = localStorage.getItem("integration");
if (integration == "true") {
    enableCapture();
} else if (integration == "false" || integration == null) {
    disableCapture();
}


