(function() {
    'use strict';
    angular
        .module('PeliculasEOI')
        .factory('TheMovieDB', TheMovieDB);
    TheMovieDB.$inject = ['$http'];
    /* @ngInject */
    function TheMovieDB($http) {
        var service = {
            getPopularMovies : getPopularMovies
        };
        return service;
        ////////////////


        var movieMovieDbUrl ="https://api.themoviedb.org/3/movie/?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var discoverMovieDBUrl="https://api.themoviedb.org/3/discover/movie?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var popular = "&sort_by=popularity.desc";
        var searchMovieDbUrl ="https://api.themoviedb.org/3/search/movie/?&api_key=70c6c34847ca16cd1a4326639172acd2";

        
       	function getPopularMovies(){
       		return $http.get(discoverMovieDBUrl+popular)
       					.then(setMovies)
       					.catch(commFailure);
       	}


       	function setMovies(response){
       		console.log("received response in themoviedb factory");
       		console.log(response);
       		return response.data;

       	}
       	function commFailure(){
       		console.log("Error de conexión en TheMovieDB Factory");
       	}



        }
    }
})();