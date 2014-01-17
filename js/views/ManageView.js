
define([
  'jquery',
  'underscore',
  'backbone',
  'models/Image',
  'Filesystem',
  'views/LargeImageView',
  'views/ManageGalleryView',
  'text!templates/manageViewTemplate.html',
  'text!templates/manageViewEmptyTemplate.html'
],function($,_, Backbone,Image,FileSystem,LargeImageView,ManageGalleryView,manageViewTemplate,manageViewEmptyTemplate) {
  var ManageView=Backbone.View.extend({

    id:"manageView",

    template: _.template(manageViewTemplate),
    emptyTemplate: _.template(manageViewEmptyTemplate),

    initialize : function(options) {

      _(this).bindAll('show','hide','hideTimer','cancelHideTimer','remove','checkLength');

      this.gallery=options.gallery
      this.gallery.bind('remove', this.checkLength);

      var largeImage=new Backbone.Model({
        image:options.gallery.length>options.imageId? options.gallery.at(options.imageId) : new Image()
      })
      
      this.largeImageView=new LargeImageView({
        model:largeImage
      });

      this.galleryView=new ManageGalleryView({
        collection:options.gallery,
        largeImage:largeImage
      });

    },

    events:{
      "mouseleave .gallery":"hideTimer",
      "mouseenter .gallery":"cancelHideTimer",
      "click #back":"back",
      "click #downloadAll":"downloadAll"
    },

    checkLength:function(){
      if(this.gallery.length==0){
        this.render();
      }
    },
    back:function(){
      window.history.back();
    },

    hideTimer:function(){
      this.timer=setTimeout(this.hide,200)
    },
    cancelHideTimer:function(){
      this.show();
      if(this.timer)clearTimeout(this.timer);
    },
    show:function(){
      this.$el.addClass("show");
    },
    hide:function(){
      this.$el.removeClass("show");
    },
    downloadAll:function(){
      this.gallery.each(function(imageModel){
        FileSystem.saveAs(imageModel.get("filename"))
      })
    },

    render : function() {
      if(this.gallery.length==0){
        this.$el.html(this.emptyTemplate({}));
      }else{
        this.$el.html(this.template({}));
        this.$el.append(this.largeImageView.render().$el)
        this.$el.append(this.galleryView.render().$el)
        this.show();
        this.hideTimer();
      }
      return this;
    },

    remove: function(){
      this.largeImageView.remove();
      this.galleryView.remove();
      Backbone.View.prototype.remove.call(this);
    }

  });

  return ManageView;

})