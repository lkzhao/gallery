define(['jquery','underscore','backbone','FileSaver'],function($,_, Backbone,FileSaver) {

  var URL = window.URL || window.webkitURL;
  return {
    downloadFile:function (url, progressModel, success) {
        var xhr = new XMLHttpRequest(); 
        xhr.open('GET', url, true); 
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () { 
            if (xhr.readyState == 4) {
                var imgURL = URL.createObjectURL(xhr.response);
                if (success) success(imgURL);
            }
        };
        xhr.addEventListener("progress", function(evt){
          if (evt.lengthComputable) {  
            progressModel.set("downloadProgress",evt.loaded / evt.total*100)
          }
        }, false); 
        xhr.send(null);
    }
  }
})

