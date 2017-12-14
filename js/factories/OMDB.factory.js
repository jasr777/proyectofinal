(function() {
    'use strict';
    angular
        .module('PeliculasEOI')
        .factory('OMDB', OMDB);
    OMDB.$inject = ['$http'];
    /* @ngInject */
    function OMDB($http) {

    	
    	var getURL = "http://www.omdbapi.com/?apikey=1da6c58c&i=";
    	var service = {
        	getMovieRating : getMovieRating,
        };
        return service;
        ////////////////


        function getMovieRating(imdbid){
        	console.log("get movie rating");
        	console.log(imdbid);
        	return $http.get(getURL+imdbid)
        			.then(setRatings)
        			.catch("Ha Habido un error en getMovieRating en OMDB");
        }

        function setRatings(response){
        	console.log("OMDB responde con la siguiente pelicula");
        	console.log(response);
        	return response;
        }


    }
})();