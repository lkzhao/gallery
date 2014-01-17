define([
  'jquery',
  'underscore',
  'backbone',
  'collections/gallery',
  'views/DefaultView',
  'views/ManageView'
], function($, _, Backbone , Gallery, DefaultView, ManageView){
  
  var app={
    defaultGallery:Gallery.defaultGallery,
    manageGallery:Gallery.manageGallery,
    defaultStateModel:new Backbone.Model({scrollPosition:0}),
    router:null,
    currentView:null,
    initialize:function(){

      var that=this;
      var AppRouter = Backbone.Router.extend({
        routes: {
          '':  'showDefault',
          'manage': 'showManage',
          'manage/:id': 'showManage',
          // Default
          '*path':  'showDefault'
        },
        showDefault:function(){
          console.log("default")
          if(that.currentView)that.currentView.remove()
          var defaultView = new DefaultView({
            gallery:that.defaultGallery,
            model:that.defaultStateModel
          })
          $(".content").append(defaultView.render().$el)
          window.scrollBy( 0, that.defaultStateModel.attributes.scrollPosition );
          that.currentView=defaultView;
        },
        showManage:function(id){
          if(!id)id=0
          console.log("manage")
          if(that.currentView)that.currentView.remove()
          var manageView = new ManageView({
            gallery:that.manageGallery,
            imageId:id
          })
          $(".content").append(manageView.render().$el)
          that.currentView=manageView;
        }
      });

      this.router=new AppRouter();
      Backbone.history.start();
      this.router.navigate("",true)
    }
  }
  return app
});