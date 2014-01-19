
define([
  'jquery',
  'underscore',
  'backbone',
  'FileSystem',
  'views/ImageView',
  'text!templates/manageImageViewTemplate.html'
],function($,_, Backbone,FileSystem,ImageView,manageImageViewTemplate) {
  var ManageImageView = ImageView.extend({

    template: _.template(manageImageViewTemplate),
    events:{
      "click a": "switchImage",
      "click .closeBtn": "removeFromCollection",
      "click .downloadBtn": "download"
    },

    removeFromCollection:function(e){
      if(this.largeImage.get("image")==this.model&&this.gallery.length>1){
        if(this.gallery.indexOf(this.model)==this.gallery.length-1){//current elem is the last one
          this.largeImage.set("image",this.gallery.at(this.gallery.indexOf(this.model)-1))
        }else{
          this.largeImage.set("image",this.gallery.at(this.gallery.indexOf(this.model)+1))
        }
      }
      this.gallery.remove(this.model)
      this.model.set({downloadProgress:0,savedImageURL:"",downloading:false})
      FileSystem.delete(this.model.get("filename"),function(){console.log("deleted")})
    },

    download:function(){
      FileSystem.saveAs(this.model.get("filename"))
    },

    switchImage:function(e){
      e.preventDefault()
      //require("app").router.navigate("manage/"+this.gallery.indexOf(this.model),false)
      this.largeImage.set("image",this.model)
    },

    initialize: function(options) {
      this.largeImage=options.largeImage;
      this.gallery=options.gallery;
      this.listenTo(this.model, "change", this.render);
    }
  });

  return ManageImageView;
})