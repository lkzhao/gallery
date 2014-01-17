
define([
  'jquery',
  'underscore',
  'backbone',
  'models/Image',
  'views/ImageView',
  'views/ZoomedImageView'
],function($,_, Backbone,Image,ImageView,ZoomedImageView) {
  var DefaultGalleryView=Backbone.View.extend({
    tagName:'ol',
    className:'gallery',

    initialize : function(options) {
      this.zoomedImageView=new ZoomedImageView({model:new Backbone.Model({
        image:new Image()
      })});

      // bind the functions 'add' and 'clear' to the view.
      _(this).bindAll('add','clear');
   
      // create an array of donut views to keep track of children
      this._imageViews = [];
   
      // add each donut to the view
      this.collection.each(this.add);
   
      // bind this view to the add events of the collection!
      this.collection.bind('add', this.add);
      this.collection.bind('reset', this.clear);
    },

    add : function(image) {
      // We create an updating donut view for each donut that is added.
      var iv = new ImageView({
        model : image,
        zoomedImageView : this.zoomedImageView
      });
   
      // And add it to the collection so that it's easy to reuse.
      this._imageViews.push(iv);
   
      // If the view has been rendered, then
      // we immediately append the rendered donut.
      if (this._rendered) {
        var currentImageView=iv.render().$el
        currentImageView.attr('style','display:none;');
        this.$el.append(currentImageView);
        this.$el.queue(function(next){
          currentImageView.fadeIn('slow');
          next();
        });
        this.$el.delay(100);
      }
    },

    clear: function(){
      this._imageViews = [];
      this.render()
    },

    render : function() {
      var that=this;
      // We keep track of the rendered state of the view
      this._rendered = true;

      this.$el.empty()
      // Render each Donut View and append them.
      _(this._imageViews).each(function(iv) {
        that.$el.append(iv.render().el);
      });

      this.$el.append($("<div class='overlay'></div>"))
      this.$el.append(this.zoomedImageView.render().$el)
   
      return this;
    },

    remove:function(){
      this.zoomedImageView.remove();
      Backbone.View.prototype.remove.call(this);
    }
  });
	

  return DefaultGalleryView

})