
define([
  'jquery',
  'underscore',
  'backbone',
  'FileSystem',
  // Using the Require.js text! plugin, we are loaded raw text
  // which will be used as our views primary template
  'text!templates/imageViewTemplate.html'
],function($,_, Backbone,FileSystem,imageViewTemplate) {
  var ImageView = Backbone.View.extend({

    template: _.template(imageViewTemplate),

    tagName: "li",

    events:{
      "mouseenter": "zoom",
      "mouseleave": "removeZoom",
      "click a": "download"
    },

    download:function(e){
      e.preventDefault();
      var that=this;
      if(this.model.get("downloading")==false&&this.model.get("downloadProgress")==100)return
      this.model.set("downloading",true)
      var m=this.model.attributes
      FileSystem.downloadFile(m.fullsizeImageURL, this.model, function(imgURL) {
        that.model.set({
          downloading:false,
          downloadProgress:100,
          savedImageURL:imgURL
        })
        require("app").manageGallery.add(that.model)
      });
    },

    zoom:function(){
      this.zoomedImageView.show(
        this.$el.position().top,
        this.$el.position().left,
        this.$el.outerWidth(),
        this.$el.outerHeight(),
        this.$el.find("img").outerWidth(),
        this.$el.find("img").outerHeight(),
        this.model
      )
    },

    removeZoom:function(){
      this.zoomedImageView.hide(this.$el.position().top,this.$el.position().left,this.$el.outerWidth(),this.$el.outerHeight())
    },

    initialize: function(option) {
      this.zoomedImageView=option.zoomedImageView
      this.listenTo(this.model, "change", this.render);
    },

    render: function() {
      if(this.model.changedAttributes.length == 1 && this.model.hasChanged('sizeclass')){
        this.$el.find("img").removeClass().addClass(this.model.get("sizeclass"))
      }if(this.model.get("downloading")&&this.model.changedAttributes.length == 1 && this.model.hasChanged('downloadProgress')){
        this.$el.find(".progressbar div").css({width:this.model.get('downloadProgress')+"%"})
      }else{
        this.$el.html(this.template(this.model.attributes));
      }
      return this;
    }
  });

  return ImageView;
})