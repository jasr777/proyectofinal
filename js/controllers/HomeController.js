(function() {
    'use strict';
    angular
        .module('PeliculasEOI')
        .controller('HomeController', HomeController);
    HomeController.$inject = ['$scope','TheMovieDB'];
    /* @ngInject */
    function HomeController($scope,TheMovieDB) {

    	/* Scope variables */

    	$scope.films = [];

    	/***************************************************/

    	/* Scope functions */
    	$scope.getDiscoveryFilms = getDiscoveryFilms;

        activate();
        ////////////////
        function activate() {
            TheMovieDB.getConfig();
        	getDiscoveryFilms();
        }

        function getDiscoveryFilms(){
        	TheMovieDB.getPopularMovies()
        	.then(setDiscoveryFilms)
        	.catch(commFailure);

        }

        function setDiscoveryFilms(films){
        	console.log("Films received in HomeController");
            console.log($scope.films);
            $scope.films = TheMovieDB.parseMovies(films);

        }







        function commFailure(){
        	console.log("Ha habido un fallo de conexión en HomeController");
        }

    }
})();