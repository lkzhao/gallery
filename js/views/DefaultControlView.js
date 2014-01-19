
define([
  'jquery',
  'underscore',
  'backbone',
  'app',
  'FileSystem',
  'models/Image',
  'views/DefaultControlView',
  'views/ZoomedImageView',
  'views/DefaultGalleryView',
  'text!templates/defaultControlViewTemplate.html'
],function($,_, Backbone,app,FileSystem,Image,DefaultControlView,ZoomedImageView,DefaultGalleryView,defaultControlViewTemplate) {
  var DefaultView=Backbone.View.extend({

    template:_.template(defaultControlViewTemplate),

    className:"navbar",

    events:{
      "click #viewSwitch": function(){
        require("app").router.navigate("manage/0",true)
      },
      "change #sizeSelect":'setSize',
      "submit #tagsForm":'setTags'
    },

    initialize : function(options) {
      _(this).bindAll('checkLocation');
      this.gallery=options.gallery
      this.loading=false;
      this.a=this.model.attributes; //shorthand for future access
      
      $(window).bind("resize.app", this.checkLocation);
      $(window).bind("scroll.app", this.checkLocation);
      this.loadNextPage();
    },
    remove: function() {
        this.removed=true;
        // unbind the namespaced event (to prevent accidentally unbinding some
        // other resize events from other code in your app
        // in jQuery 1.7+ use .off(...)
        $(window).unbind("resize.app");
        $(window).unbind("scroll.app");

        // don't forget to call the original remove() function
        Backbone.View.prototype.remove.call(this);
        // could also be written as:
        // this.constructor.__super__.remove.call(this);
    }, 
    getURL:function(){
      return this.a.url.domain
    },

    getSize:function(){
      return this.a.sizes[this.a.currentSizeIndex].addition
    },

    checkLocation:function (){
      var currentLocation=$(window).scrollTop() + $(window).height();
      if(currentLocation >= 40+200*this.a.pageNum*this.a.rateNum/5-$(window).height() && this.a.nomore==false) {
        this.loadNextPage();
      }else if(currentLocation == $(document).height()&&this.a.nomore){
        console.log("no more")
      }
    },

    loadNextPage: function() {
      if(this.loading) return;
      var that=this;
      this.loading=true;
      this.model.set("pageNum",this.a.pageNum+1);

      console.log("Loading:"+this.getURL()+" page "+this.a.pageNum +" with tags "+this.a.tags+" landscape "+this.getSize())
      $.ajax({
        url:this.getURL(),
        dataType: 'json',
        data:{rate:this.a.rateNum,page:this.a.pageNum,tags:this.a.tags+" landscape "+this.getSize()},
        success:function(data){
          that.displayImages(data);
        },
        error:function(e) { 
          console.log(e.responseText)
        }
      })
    },

    displayImages: function (data) {
      var that=this;
      if(data.length==0){
        console.log("no more")
        this.loading=false;
        this.model.set("nomore",true);
        return;
      }
      $.each(data,function(i,imageData){
        console.log(imageData)
        var filename=decodeURIComponent(imageData.url.substr(imageData.url.lastIndexOf("/") + 1))
        var currrentImage=new Image({
          "width":  imageData.width,
          "height":   imageData.height,
          "page":   that.getURL()+'/show/'+imageData.id,
          "thumbnailImageURL":  imageData.thumbnailUrl,
          "fullsizeImageURL":  imageData.url,
          "savedImageURL":  "",
          "filename":filename,
          "tags": imageData.tags,
          "sizeclass": "wide",
          "downloading":  false,
          "downloadProgress":0
        })
        that.gallery.add(currrentImage)
      })
      this.loading=false;
      if(!this.removed) this.checkLocation();
    },

    refresh:function(){
      window.scrollTo(0,0);
      this.model.set({nomore:false,pageNum:0});
      this.gallery.reset();
      this.loadNextPage();
    },

    setTags:function(e){
      e.preventDefault()
      this.model.set("tags",$("#tagsInput").val())
      this.refresh()
    },

    setSize:function(){
      console.log("size changed")
      this.model.set("currentSizeIndex",parseInt($('#sizeSelect').val()))
      this.refresh()
    },

    render : function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
  

  return DefaultView;

})