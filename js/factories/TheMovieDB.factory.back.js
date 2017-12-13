(function() {
    'use strict';
    angular
        .module('TheMovieDB')
        .factory('TheMovieDB', TheMovieDB);
    TheMovieDB.$inject = ['$http'];
    /* @ngInject */
    function TheMovieDB($http) {

    	        // Factory variables

        var configurationMovieDbUrl = "https://api.themoviedb.org/3/configuration?api_key=70c6c34847ca16cd1a4326639172acd2";
        var movieMovieDbUrl ="https://api.themoviedb.org/3/movie/?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var discoverMovieDBUrl="https://api.themoviedb.org/3/discover/movie?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var searchMovieDBUrl = "https://api.themoviedb.org/3/search/movie?api_key=70c6c34847ca16cd1a4326639172acd2";
        var popular = "&sort_by=popularity.desc";
        var pageStr = "&page=";
        var queryStr="&query="
        var greaterDate ="&primary_release_date.gte="
        var searchMovieDbUrl ="https://api.themoviedb.org/3/search/movie/?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var config = {};
        var currentDate = new Date().toISOString().substring(0,10);
        var totalCount = 0;


        var service = {
            getPopularMovies : getPopularMovies,
            getConfig : getConfig,
            parseMovies : parseMovies,
            getByPagePopular : getByPagePopular,
            getUnreleasedMovies : getUnreleasedMovies,
            getNextPage : getNextPage,
            searchMovies : searchMovies
        };
        return service;
        ////////////////


        function getConfig(){
          console.log("Initiating config setup...")
          return $http.get(configurationMovieDbUrl)
                  .then(setConfig)
                  .catch(() => {
                    console.log("Error en getConfig() en TMDBFactory");
                  });
        }

        function setConfig(response){
          console.log("Configuration object received in TheMovieDB factory");
          config = response.data.images;
          console.log(config);
        }

       	function getPopularMovies(){
       		return $http.get(discoverMovieDBUrl+popular)
       					.then(setMovies)
                .catch( () => {
                  console.log("Error en getPopularMovies() en TMDBFactory");
                });
       	}

        function getUnreleasedMovies(){
          
          return $http.get(discoverMovieDBUrl+greaterDate+currentDate)
                  .then(setMovies)
                  .catch( () => {
                    console.log("Error en getUnreleasedMovies() en TMDBFactory");
                  });
                 
        }
        function searchMovies(query){
          return $http.get(searchMovieDbUrl+queryStr+query)
                  .then(setMovies)
                  .catch( () => {
                    console.log("Error en searchMovies() en TMDBFactory");
                  });
        }

        function getNextPage (pageNumber, currentPage){
          console.log("numero de pagina pedido" + pageNumber);
          console.log("la pagina está en : " + currentPage);

          switch (currentPage){
            case 0  : return getByPagePopular(pageNumber);
                      break;
                 
            case 1 : return getByPageUnreleased(pageNumber);
                     break;
          }
        }

        function getByPagePopular(page){
          console.log("getting popular films in page "+page);
          return $http.get(discoverMovieDBUrl + popular + pageStr + page)
                 .then(setMovies)
                  .catch( () => {
                    console.log("Error en getByPagePopular() en TMDBFactory");
                  });

        }

        function getByPageUnreleased(page){
          console.log("getting pages by unreleased in page " + page)
          return $http.get(discoverMovieDBUrl+greaterDate+currentDate+pageStr+page)
                .then(setMovies)
                .catch( () => {
                  console.log("Error en getByPageUNreleased() en TMDBFactory");
                });
                
        }
       	function setMovies(response){
       		console.log("received response in themoviedb factory");
       		console.log(response);
          totalCount = response.
          return response;
       	}
        function parseMovies(movies){
          // El parse toca hacerlo en el home controller
          let parsedMovies = [];
            for(var i = 0; i < movies.length ; i++){
                let parsedMovie = {};
                parsedMovie = Object.assign({}, movies[i]);
                parsedMovie.fallback_poster = "img/generic-film.jpg";
                parsedMovie.regular_poster =config.base_url + config.poster_sizes[3] + movies[i].poster_path;
                parsedMovie.poster = config.base_url + config.poster_sizes[4] + movies[i].poster_path;
                parsedMovies.push(parsedMovie);
            }
          return parsedMovies;
        }
        




       
    }
})();