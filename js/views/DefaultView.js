
define([
  'jquery',
  'underscore',
  'backbone',
  'views/DefaultControlView',
  'views/DefaultGalleryView'
],function($,_, Backbone,DefaultControlView,DefaultGalleryView) {
  var DefaultView=Backbone.View.extend({
    id:"defaultView",

    initialize : function(options) {

      var self = this;
      $( window ).on( 'scroll.defaultview', function () {
         self.model.set("scrollPosition",this.pageYOffset);
      });

      this.galleryView=new DefaultGalleryView({
        collection:options.gallery,
      });

      this.controlView=new DefaultControlView({
        gallery:options.gallery,
        model:new Backbone.Model({
          tags:"",
          rateNum:10,
          pageNum:options.gallery.length/10,
          currentSizeIndex:0,
          nomore:false,
          sizes:[
            {name:'Any',addition:""},
            {name:"1280x720~",addition:"width:1280 height:720..800"},
            {name:"1920x1080~",addition:"width:1920 height:1080..1200"},
            {name:"2560x1440~",addition:"width:2560 height:1440..1600"},
            {name:"1280x720+",addition:"width:>1280 height:>800"},
            {name:"1920x1080+",addition:"width:>1920 height:>1200"},
            {name:"2560x1440+",addition:"width:>2560 height:>1600"}
          ],
          url:{domain:"http://konachan.com",post:"/post"}
        })
      });
    },

    render : function() {
      this.$el.empty()
      this.$el.append(this.controlView.render().$el)
      this.$el.append(this.galleryView.render().$el)
      return this;
    },

    remove: function(){
      $(window).unbind("scroll.defaultview");
      this.controlView.remove();
      this.galleryView.remove();
      Backbone.View.prototype.remove.call(this);
    }

  });

  return DefaultView;

})