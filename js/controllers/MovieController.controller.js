(function() {
    'use strict';
    angular
        .module('PeliculasEOI')
        .controller('MovieController', MovieController);
    MovieController.$inject = ['$scope','$routeParams','TheMovieDB','OMDB'];
    /* @ngInject */
    function MovieController($scope,$routeParams,TheMovieDB,OMDB) {


    	var id = $routeParams.id;
		$scope.movie = {};        
        activate();
        ////////////////
        function activate() {
        	console.log("Movie controller ID received " + id);
        	TheMovieDB.getConfig();
        	getMovie(id);


        
        }

        function getMovie(id){
        	TheMovieDB.getMovie(id).then(setMovie).catch( () => {console.log("Ha Habdio un error en getMovie() en MovieController")});
        }
        function setMovie(response){
        	console.log(response);
        	$scope.movie = TheMovieDB.parseMovie(response);
        	console.log("Set movie en MC va a coger los ratings")
        	getRatings($scope.movie.imdb_id);

        	console.log("movie received in moviecontroller");
        	console.log($scope.movie);
        }

        function getRatings(imdbid){
        	console.log("get ratings en MC");
        	console.log(imdbid);
        	OMDB.getMovieRating($scope.movie.imdb_id)
        		.then(setRatings)
        		.catch("Ha habido un error en getRatings en MovieController");
        }

        function setRatings(response){ 
        	let ratings = response.data.Ratings;
        	
        	$scope.movie.ratings = formatRatings(ratings);

        	console.log($scope.movie.ratings);
        	//$scope.movie.ratings = response.data.Ratings;
        }

        function formatRatings(ratings){
        	console.log("parseratings");
        	console.log(ratings);
        	let parsedRatings = ratings;
        	console.log("parsedRatings ");
        	console.log(parsedRatings);

        	parsedRatings[0] = parsedRatings[0].Value.replace("/10","");
        	parsedRatings[1] = parsedRatings[1].Value;
        	parsedRatings[2] = parsedRatings[2].Value.replace("/100","");        	
        	console.log(parsedRatings);
        	return parsedRatings;

        }
    }
})();