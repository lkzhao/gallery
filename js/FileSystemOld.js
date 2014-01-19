define(['jquery','underscore','backbone','FileSaver'],function($,_, Backbone,FileSaver) {
  // IndexedDB
  var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
      IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
      dbVersion = 1.0;

  var errorHandler=function(e){
    console.log(e.value)
  }

  var db=null
  // Create/open database
  var request = indexedDB.open("downloadedImage", dbVersion)
  request.onupgradeneeded = function(e) {
    var v = "1.0";
    var db = e.target.result;

    // A versionchange transaction is started automatically.
    e.target.transaction.onerror = errorHandler;

    if(db.objectStoreNames.contains("image")) {
      db.deleteObjectStore("image");
    }

    var store = db.createObjectStore("image", {keyPath: "timeStamp"});
  }
  request.onsuccess = function(e) {
    db = e.target.result;
  };
  request.onerror=errorHandler;

  return {
    saveAs:function(filename){
      this.readBlob(filename,function(blob){
        FileSaver.saveAs(blob,filename)
      })
    },
    exists:function (path, callback) {
      callback()
    },
    delete:function(path, success){
      var request = db.transaction(["image"], "readwrite").objectStore("image").delete(path);
      request.onsuccess =success
      request.onerror = errorHandler
    },
    downloadFile:function (url, progressModel, success) {
        var xhr = new XMLHttpRequest(); 
        xhr.open('GET', url, true); 
        xhr.responseType = "blob";
        xhr.onreadystatechange = function () { 
            if (xhr.readyState == 4) {
                if (success) success(xhr.response);
            }
        };
        xhr.addEventListener("progress", function(evt){
          if (evt.lengthComputable) {  
            progressModel.set("downloadProgress",evt.loaded / evt.total*100)
          }
        }, false);
        xhr.send(null);
    },
    saveFile:function (blob,path,success) {
      var request = db.transaction(["image"], "readwrite").objectStore("image").put({
        "data": blob,
        "timeStamp": new Date().getTime()
      });
      request.onsuccess ==success;
      request.onerror=errorHandler;
    },
    readDataURL:function (path, success) {
      console.log("requesting "+path)
      var request = db.transaction(["image"], "readwrite").objectStore("image").get(path);
      request.onsuccess == function(event){
        var imgFile = event.target.result;
        var URL = window.URL || window.webkitURL;
        var imgURL = URL.createObjectURL(imgFile);
        success(imgURL)
      };
      request.onerror=function(e){console.log(e.value);success()};
    },
    readBlob:function (path, success) {
      var request = db.transaction(["image"], "readwrite").objectStore("image").get(path);
      request.onsuccess == function(event){
        success(event.target.result);
      };
      request.onerror=errorHandler;
    }
    
  }
})

