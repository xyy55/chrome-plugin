chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  var xhr = new XMLHttpRequest();
  var data = []
  for (var i = 0; i < request.length; i++) {
    xhr.open("GET", request[i], false);
    xhr.send();
    data.push(JSON.parse(xhr.responseText));
  }
  callback(data)
  return true;
});


