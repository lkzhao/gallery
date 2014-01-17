requirejs.config({
    //By default load any module IDs from /js/
    baseUrl: 'js',
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


require(["app"], function(app) {
    app.initialize();
});

  


  



