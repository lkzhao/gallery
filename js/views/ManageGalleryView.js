
define([
  'jquery',
  'underscore',
  'backbone',
  'models/Image',
  'views/ManageImageView'
],function($,_, Backbone,Image,ManageImageView) {
  var ManageGalleryView=Backbone.View.extend({
    tagName:'ol',
    className:'gallery',

    initialize : function(options) {

      this.largeImage=options.largeImage

      // bind the functions 'add' and 'clear' to the view.
      _(this).bindAll('add','clear','remove');
   
      // create an array of donut views to keep track of children
      this._imageViews = [];
   
      // add each donut to the view
      this.collection.each(this.add);
   
      // bind this view to the add events of the collection!
      this.collection.bind('add', this.add);
      this.collection.bind('remove', this.remove);
      this.collection.bind('reset', this.clear);
    },

    remove : function(model) {
      var viewToRemove = _(this._imageViews).select(function(cv) { return cv.model === model; })[0];
      this._imageViews = _(this._imageViews).without(viewToRemove);
   
      if (this._rendered&&viewToRemove) $(viewToRemove.el).remove();
    },

    add : function(image) {
      // We create an updating donut view for each donut that is added.
      var iv = new ManageImageView({
        model : image,
        largeImage : this.largeImage,
        gallery: this.collection
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

      this.$el.empty();
      // Render each Donut View and append them.
      _(this._imageViews).each(function(iv) {
        that.$el.append(iv.render().el);
      });
   
      return this;
    }
  });
  

  return ManageGalleryView

})