define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/zoomedImageViewTemplate.html'
  ],function($,_, Backbone,zoomedImageViewTemplate) {
  
  var ZoomedImageView=Backbone.View.extend({

    template: _.template(zoomedImageViewTemplate),

    className:'zoomedImage',

    timeout:null,

    initialize: function() {
      var that=this;
      this.listenTo(this.model, "change", function(){
        that.stopListening(this.model.previous("image"));
        that.listenTo(this.model.get("image"), "change", that.renderImage);
        that.render();
      });
      this.listenTo(this.model.get("image"), "change", this.renderImage);
    },

    hide:function(top,left,width,height){
      this.timeout=window.setTimeout(this._hide.bind(this,top,left,width,height),150)
    },

    _hide:function(top,left,width,height){
      var that=this;
      this.$el.css({width:width,height:height,top:top,left:left})
      that.$el.removeClass("highlight")
      that.timeout=window.setTimeout(function(){
        that.$el.css("display","none")
        that.timeout=null
      },150)
    },

    show:function(top,left,width,height,imgwidth,imgheight,image){
      if(this.timeout){//has timeout: moved from another image
        window.clearTimeout(this.timeout)
        this.timeout=null
      }else{//no previous
        this.$el.addClass("notransition")
        this.$el.removeClass("highlight")
        this.$el.css({display:"block",width:width,height:height,top:top,left:left})
        this.$el.removeClass("notransition")
      }
      imgheight*=1.1;
      imgwidth=imgwidth*1.1-5;
      top-=(imgheight-height)/2;
      left-=(imgwidth-width)/2;
      top=top<40?40:top;
      top=((top+imgheight)>$(document).height())?$(document).height()-imgheight:top;
      left=left<0?0:left;
      left=((left+imgwidth)>$(window).width())?$(window).width()-imgwidth:left;

      this.$el.addClass("highlight")
      this.$el.css({width:imgwidth,height:imgheight,top:top,left:left})
      this.model.set("image",image)
    },

    render: function() {
      this.$el.html(this.template(this.model.get("image").attributes));
      return this;
    },

    renderImage:function(){
      if(this.model.get("image").get("downloading")&&this.model.get("image").changedAttributes.length == 1 && this.model.get("image").hasChanged('downloadProgress')){
        this.$el.find(".progressbar div").css({width:this.model.get("image").get('downloadProgress')+"%"})
      }else{
        this.$el.html(this.template(this.model.get("image").attributes));
      }
      return this
    }
  });
  
  return ZoomedImageView;
});