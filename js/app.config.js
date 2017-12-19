(function() {
    'use strict';
    angular.module('PeliculasEOI', ['ngRoute','rzModule']).config(config);    
    
    config.$inject=['$routeProvider','$sceProvider'];
    
    function config($routeProvider, $sceProvider){
       // if (,mode == 'prod')
       // Esto evita que se muestren cosas en consola para no quitar todos los console.log, debug only
        console.log = () => {};
       // $sceProvider.enabled(false);
        $routeProvider.when("/" , {
            controller : 'HomeController',
            templateUrl : '/views/home.html'
        })

        .when("/movie/:id" , {
        	controller:'MovieController',
        	templateUrl :'/views/modal.html'
        })
    
         
    }

})();