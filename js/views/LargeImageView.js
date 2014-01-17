
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/largeImageViewTemplate.html'
],function($,_, Backbone,largeImageViewTemplate) {
  var ImageView = Backbone.View.extend({

    template: _.template(largeImageViewTemplate),

    className:'largeImageView',

    initialize: function(option) {
      var that=this;
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model.get("image"), "change", this.render);
    },


    render: function() {
      this.$el.html(this.template(this.model.get("image").attributes));
      return this;
    }
  });

  return ImageView;
})