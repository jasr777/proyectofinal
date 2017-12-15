(function() {
    'use strict';
    angular
        .module('PeliculasEOI')
        .controller('MovieController', MovieController);
    MovieController.$inject = ['$scope','$routeParams','TheMovieDB','OMDB','$sce'];
    /* @ngInject */
    function MovieController($scope,$routeParams,TheMovieDB,OMDB, $sce) {


    	var id = $routeParams.id;
		$scope.movie = {};        
        activate();
        ////////////////
        function activate() {
        	console.log("Movie controller ID received " + id);
        	TheMovieDB.getConfig();
        	getMovie(id);
            console.log("MOVIE WITH ID :" + id);
       
        }

        function getMovie(id){
        	TheMovieDB.getMovie(id).then(setMovie).catch( () => {console.log("Ha Habdio un error en getMovie() en MovieController")});
        }
        function setMovie(response){
        	console.log(response);
        	$scope.movie = TheMovieDB.parseMovie(response);
        	
        	getRatings($scope.movie.imdb_id);
            getSimilars(id);
            getTrailers(id);
        	console.log("movie received in moviecontroller");
        	console.log($scope.movie);
        }

        function getRatings(imdbid){
        	OMDB.getMovieRating($scope.movie.imdb_id)
        		.then(setRatings)
        		.catch("Ha habido un error en getRatings en MovieController");
        }

        function setRatings(response){ 
        	let ratings = response.data.Ratings;
        	
        	$scope.movie.ratings = formatRatings(ratings);

        }

        function getSimilars(id){
            TheMovieDB.getSimilarMovies(id)
                       .then(setSimilar)
                       .catch( () => {
                        console.log("Ha habido un error en getSimilars(id) en MovieController");
                       })

        }

        function setSimilar(response){
            $scope.movie.similars = TheMovieDB.parseSimilars( response.results);

        }


        function getTrailers(id){
            console.log("Getting trailers for id " + id);
            TheMovieDB.getVideos(id)
                      .then(setTrailers)
                      .catch( () => {
                        console.log("Error en getTrailers() en MovieController");
                      });

        }



        function setTrailers(response){
            console.log("Trailers received in MovieController");

            console.log(response.data.results);   
           // let trailers = TheMovieDB.parseTrailers(response.data.results);
            $scope.movie.trailer = $sce.trustAsResourceUrl(TheMovieDB.parseTrailers(response.data.results));
            console.log("Trailers after parsing : ");
            console.log($scope.movie.trailer);
            //$scope.movie.trailers = TheMovieDB.parseTrailers()

        }

        function formatRatings(ratings){
        	let parsedRatings = ratings;

        	parsedRatings[0] = parsedRatings[0].Value.replace("/10","");
        	parsedRatings[1] = parsedRatings[1].Value;
        	parsedRatings[2] = parsedRatings[2].Value.replace("/100","");        	
        	return parsedRatings;

        }
    }
})();