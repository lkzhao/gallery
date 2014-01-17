define(['underscore','backbone','models/Image','localStorage'],function(_, Backbone,Image,localStorage) {
  var Gallery = Backbone.Collection.extend({
    model: Image
  });
  return {defaultGallery:new Gallery(),manageGallery:new Gallery()};
})