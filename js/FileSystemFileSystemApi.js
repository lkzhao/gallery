define(['jquery','underscore','backbone','FileSaver'],function($,_, Backbone,FileSaver) {

  function errorHandler(e) {
      var msg = '';

      switch (e.code) {
          case FileError.QUOTA_EXCEEDED_ERR:
              msg = 'QUOTA_EXCEEDED_ERR';
              break;
          case FileError.NOT_FOUND_ERR:
              msg = 'NOT_FOUND_ERR';
              break;
          case FileError.SECURITY_ERR:
              msg = 'SECURITY_ERR';
              break;
          case FileError.INVALID_MODIFICATION_ERR:
              msg = 'INVALID_MODIFICATION_ERR';
              break;
          case FileError.INVALID_STATE_ERR:
              msg = 'INVALID_STATE_ERR';
              break;
          default:
              msg = 'Unknown Error';
              break;
      };

      console.log('Error: ' + msg);
  }

  window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  window.storageInfo = window.storageInfo || window.webkitStorageInfo;

  // Request access to the file system
  var fileSystem = null         // DOMFileSystem instance
    , fsType = TEMPORARY       // PERSISTENT vs. TEMPORARY storage 
    , fsSize = 1000 * 1024 * 1024 // size (bytes) of needed space 
    ;

  window.storageInfo.requestQuota(fsType, fsSize, function(gb) {
      window.requestFileSystem(fsType, gb, function(fs) {
          fileSystem = fs;
      }, errorHandler);
  }, errorHandler);

  return {
    saveAs:function(filename){
      this.readBlob(filename,function(blob){
        FileSaver.saveAs(blob,filename)
      })
    },
    exists:function (fileName, callback) {
        // var that= this;
        // fileSystem.root.getFile(fileName, {create : false}, function() {
        //     that.readDataURL(fileName,callback)
        // }, function() {
        //     callback();
        // });
        
            callback();
    },
    delete:function(path, success){
      fileSystem.root.getFile(path, {}, function(fileEntry) {
            fileEntry.remove(success,errorHandler)
        }, errorHandler);
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
    saveFile:function (data, path, success) {
        if (!fileSystem){return;}

          fileSystem.root.getFile(path, {create: true}, function(fileEntry) {
            fileEntry.createWriter(function(writer) {
              if (success) writer.onwriteend = success;
              writer.write(data);
            }, errorHandler);
          }, errorHandler);
    },
    readDataURL:function (path, success) {
        fileSystem.root.getFile(path, {}, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    if (success) success(this.result);
                };

                reader.readAsDataURL(file);
            }, errorHandler);
        }, errorHandler);
    },
    readBlob:function (path, success) {
        fileSystem.root.getFile(path, {}, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    if (success) success(new Blob([this.result]));
                };

                reader.readAsArrayBuffer(file);
            }, errorHandler);
        }, errorHandler);
    }
    
  }
})

