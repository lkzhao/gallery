requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        jquery: 'jquery-1.10.2.min',
        underscore: 'underscore-min',
        backbone:'backbone-min',
        filesaver:'FileSaver',
        filesystem:'fileSystem',
    },
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});


require([
    "jquery",
    "underscore",
    "backbone",
    "app"
    ], 
  function($,_,Backbone,app) {
    app.initialize();
});

  


  



