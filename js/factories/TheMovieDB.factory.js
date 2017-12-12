(function() {
    'use strict';
    angular
        .module('PeliculasEOI')
        .factory('TheMovieDB', TheMovieDB);
    TheMovieDB.$inject = ['$http'];
    /* @ngInject */
    function TheMovieDB($http) {

        // Factory variables

        var configurationMovieDbUrl = "https://api.themoviedb.org/3/configuration?api_key=70c6c34847ca16cd1a4326639172acd2";
        var movieMovieDbUrl ="https://api.themoviedb.org/3/movie/?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var discoverMovieDBUrl="https://api.themoviedb.org/3/discover/movie?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var popular = "&sort_by=popularity.desc";
        var searchMovieDbUrl ="https://api.themoviedb.org/3/search/movie/?&api_key=70c6c34847ca16cd1a4326639172acd2";

        var config = {};

        var service = {
            getPopularMovies : getPopularMovies,
            getConfig : getConfig,
            parseMovies : parseMovies
        };
        return service;
        ////////////////






        /* Config returns 'configuration' object needed for setting images */

        function getConfig(){
          console.log("Initiating config setup...")
          return $http.get(configurationMovieDbUrl)
                  .then(setConfig)
                  .catch(configError)
        }
        


        function setConfig(response){
          console.log("Configuration object received in TheMovieDB factory");
          config = response.data;
          console.log(config);
          
        }




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

        function parseMovies(movies){
          // El parse toca hacerlo en el home controller
          let parsedMovies = [];

          console.log("Movies to parse : ")
          console.log(movies.results);


          for(var i = 0; i < movies.results.length ; i++){
            let parsedMovie = {};
            console.log("Parsing movie : ");
            console.log(movies.results[i]);
            parsedMovie.overview = movies.result[i].overview;
            console.log("overview done");
            parsedMovie.release_date = movies.result[i].release_date;
            console.log("release_date done");
            parsedMovie.genre_ids = movies.result[i].genre_ids;
            console.log("genre_ids done");
            parsedMovie.id = movies.result[i].id;
            console.log("id done");
            parsedMovie.title = movies.result[i].title;
            console.log("title done");
            parsedMovie.regular_poster =config.base_url + config.poster_size[3] + movies.result[i].poster_path;
            console.log("regular_poster done");
            parsedMovie.poster = config.base_url + config.poster_size[4] + movies.result[i].poster_path;
            console.log("poster done");
            console.log("Movie parsed : ");
            console.log(parsedMovie);
            parsedMovies.push(parsedMovie);

          }

          return movies;

        }



        function configError(){
          console.log("Error de conexión en TheMovieDB Factory : getConfig");
        }
       	function commFailure(){
       		console.log("Error de conexión en TheMovieDB Factory : getPopularMovies()");
       	}



        }
    
})();