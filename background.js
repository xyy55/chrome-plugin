const user = function () {
    var obj = {};

    obj.getUid = function () {
        var uid = localStorage.getItem("pankiller-uid");
        if (!uid) {
            uid = obj.randString(32);
            localStorage.setItem("pankiller-uid", uid);
        }
        return uid;
    };

    obj.randString = function (length) {
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        var text = "";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    return obj;
}();
let env = {
    mode: "script",
    aid: "violentmonkey",
    uid: user.getUid(),
    version: "0.3.7",
    browser: "chrome"
};
const source = {
    baidu: "baidu",
    weiyun: "weiyun",
    lanzous: "lanzous"
};
const runtime = function () {
    let obj = {
        url: "",
        sharePwd: "",
        yunpan_type: ""
    };
    obj.getUrl = function () {
        return obj.url;
    };

    obj.setUrl = function (url) {
        obj.url = url;
        obj.sharePwd = "";
        obj.yunpan_type = "";
    };
    obj.getUrlParam = function (name) {
        let param = obj.parseUrlParam(obj.url);
        if (name) {
            return param.hasOwnProperty(name) ? param[name] : null;
        }
        else {
            return param;
        }
    };

    obj.parseUrlParam = function (url) {
        if (url.indexOf("?")) {
            url = url.split("?")[1];
        }
        let reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
        let obj = {};
        while (reg.exec(url)) {
            obj[RegExp.$1] = RegExp.$2;
        }
        return obj;
    };

    return obj;
}();
const svgCrypt = function () {
    let obj = {};

    obj.getReqData = function () {
        let reqTime = Math.round(new Date().getTime() / 1000);
        let reqPoint = obj.getStrPoint("timestamp:" + reqTime);
        return {
            req_time: reqTime,
            req_point: reqPoint
        };
    };

    obj.getStrPoint = function (str) {
        if (str.length < 2) {
            return "0:0";
        }

        let path = "";
        let current, last = str[0].charCodeAt();
        let sum = last;
        for (let i = 1; i < str.length; i++) {
            current = str[i].charCodeAt();
            if (i == 1) {
                path = path + "M";
            } else {
                path = path + " L";
            }
            path = path + current + " " + last;
            last = current;
            sum = sum + current;
        }
        path = path + " Z";
        let index = sum % str.length;
        let data = Snap.path.getPointAtLength(path, str[index].charCodeAt());
        return data.m.x + ":" + data.n.y;
    };

    return obj;
}();

const api = function () {
    let obj = {
        base: ""
    };

    obj.querySharePwd = function (shareSource, shareId, shareLink, callback) {
        let data = {
            share_id: shareId,
            share_point: svgCrypt.getStrPoint(shareId),
            share_link: shareLink,
            share_source: shareSource
        };
        obj.requestApi("http://www.it233.com/api/yunpan_code", data, function (response) {
            if (response && response.code == 0) {
                callback && callback(response);
            }
            else {
                callback && callback({});
            }
        });
    };

    obj.requestApi = function (path, data, callback) {
        data.mode = env.mode;
        data.aid = env.aid;
        data.uid = env.uid;
        data.version = env.version;
        data.browser = env.browser;

        $.ajax({
            type: "get",
            url: obj.base + path,
            dataType: "json",
            data: data,
            success: function (response) {
                callback && callback(response);
            },
            error: function (error) {
                callback && callback({});
            }
        });
    };

    return obj;
}();
const key_baidu = function () {
    let obj = {};

    obj.check = function () {
        let url = runtime.getUrl();
        if (url.indexOf(".baidu.com/s/") > 0
            || url.indexOf(".baidu.com/disk/home") > 0
            || url.indexOf(".baidu.com/disk/timeline") > 0
            || url.indexOf(".baidu.com/share/init") > 0) {
            return true;
        }
        else {
            return false;
        }
    };

    obj.getSharePwd = function (callback) {
        let shareId = obj.getShareId();
        let shareLink = runtime.getUrl();
        api.querySharePwd(source.baidu, shareId, shareLink, function (response) {
            if (response && response.code == 0) {
                runtime.sharePwd = response.data.share_pwd;
            }
            callback();
        });
    };

    obj.getShareId = function () {
        let shareId = runtime.getUrlParam("surl");
        if (shareId) {
            return shareId;
        }
        else {
            let match = runtime.url.match(/\/s\/1(\S+)/);
            return match ? match[1] : null;
        }
    };

    return obj;
}();
const defaultRPC = '[{"name":"ARIA2 RPC","url":"http://localhost:6800/jsonrpc"}]';
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    //   let xhr = new XMLHttpRequest();
    //   let data = []
    //   for (let i = 0; i < request.length; i++) {
    //     xhr.open("GET", request[i], false);
    //     xhr.send();
    //     data.push(JSON.parse(xhr.responseText));
    //   }
    //   callback(data)
    //   return true;
    runtime.setUrl(request);
    key_baidu.getSharePwd(function (sharePwd) {
        if (runtime.sharePwd) {
            console.log('提取码：' + runtime.sharePwd);
            callback(runtime.sharePwd)
        }
        else {
            console.log('暂无人分享密码');
        }
    })
    return true;
});
let HttpSendRead = function (info) {
    Promise.prototype.done = Promise.prototype.then;
    Promise.prototype.fail = Promise.prototype.catch;
    return new Promise(function (resolve, reject) {
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
        http.onreadystatechange = function () {
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
    let notification = chrome.notifications.create(id, opt, function (notifyId) {
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
    }, function (cookies) {
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
        HttpSendRead(parameter).done(function (json, textStatus, jqXHR) {
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
        }).fail(function (jqXHR, textStatus, errorThrown) {
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
    if (integration == "true") {
        let rpc_list = JSON.parse(defaultRPC);
        chrome.downloads.cancel(downloadItem.id);
        console.log(downloadItem)
        aria2Send(downloadItem.url, rpc_list[0]['url'], downloadItem);
    }
}
window.addEventListener('storage', function (se) {
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


