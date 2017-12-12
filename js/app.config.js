(function() {
    'use strict';
    angular.module('PeliculasEOI', ['ngRoute']).config(config);    
    
    config.$inject=['$routeProvider'];
    
    function config($routeProvider){
        
        $routeProvider.when("/" , {
            controller : 'HomeController',
            templateUrl : '/views/home.html'
        })
/*
        .when("/movie/:id" , {
        	controller:'MovieController',
        	templateUrl :'/views/modal.html'
        })
  */      
         
    }

})();