window.addEventListener('load', function(){
  requirejs.config({
    baseUrl: 'js',
    paths: {
      jquery: 'lib/jquery',
      lodash: 'lib/lodash',
      backbone: 'lib/backbone',
      jointjs: 'lib/joint.min'
    },
    map: {
      '*': {
        // Backbone requires underscore. This forces requireJS to load lodash instead:
        'underscore': 'lodash'
      }
    }

  });

  require(['test'], function(init){
    init();
  });
});