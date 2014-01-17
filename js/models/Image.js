define(['jquery','underscore','backbone'],function($,_, Backbone) {

  var liWidth=$(window).width()/5
  $(window).resize(function(e){
    liWidth=$(window).width()/5;
  })
  var liHeight=200;

  var Image=Backbone.Model.extend({
    initialize:function(){
      var that=this;
      //check if the image is wide or tall
      if(this.get("width")/this.get("height")>(liWidth/liHeight)){
        this.attributes['sizeclass']="wide"//set attribute without triggering a event
      }else{
        this.attributes['sizeclass']="tall"//set attribute without triggering a event
      }
      $(window).bind("resize",function(){//recalculate sizeclass when resize
        if(that.get("width")/that.get("height")>(liWidth/liHeight)){
          that.set({"sizeclass":"wide"});//this will trigger event
        }else{
          that.set({"sizeclass":"tall"});
        }
      })
    },
    defaults: {
      "width":  0,
      "height":   0,
      "page":    "",
      "thumbnailImageURL":  "",
      "fullsizeImageURL":  "",
      "savedImageURL":  "",
      "filename":     "",
      "tags":    "",
      "sizeclass": "wide",
      "downloadProgress" :0,
      "downloading":false
    }
  })

  $(window).resize(function(e){
    liWidth=$(window).width()/5;
  })
  return Image;
})