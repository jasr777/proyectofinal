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
        	return $http.get(getURL+imdbid)
        			.then(setRatings)
        			.catch("Ha Habido un error en getMovieRating en OMDB");
        }

        function setRatings(response){
        	return response;
        }

    }
})();