(function() {
    'use strict';
    angular
        .module('PeliculasEOI')
        .factory('TheMovieDB', TheMovieDB);
    TheMovieDB.$inject = ['$http'];
    /* @ngInject */
    function TheMovieDB($http) {


        /* Factory Variables  ------------*/
        var configurationMovieDbUrl = "https://api.themoviedb.org/3/configuration?api_key=70c6c34847ca16cd1a4326639172acd2";
        var movieMovieDbUrl ="https://api.themoviedb.org/3/movie/?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var discoverMovieDBUrl="https://api.themoviedb.org/3/discover/movie?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var searchMovieDBUrl = "https://api.themoviedb.org/3/search/movie?api_key=70c6c34847ca16cd1a4326639172acd2&query=";
        var popular = "&sort_by=popularity.desc";
        var pageStr = "&page=";
      //  var queryStr = "&query=";
        var greaterDate ="&primary_release_date.gte=";
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

        /* Config returns 'configuration' object needed for setting images */

        function getConfig() {
          console.log("Initiating config setup...");
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


        function setMovies(response){          
          console.log("received response in TMDBFactory");
          //totalCount = films.data.total_results;
          return response;
        }

        function parseMovies(movies){
          // El parse toca hacerlo en el home controller
          let parsedMovies = [];
            for(var i = 0; i < movies.length; i++){
                let parsedMovie = {};
                parsedMovie = Object.assign({}, movies[i]);
                parsedMovie.fallback_poster = "img/generic-film.jpg";
                parsedMovie.regular_poster =config.base_url + config.poster_sizes[3] + movies[i].poster_path;
                parsedMovie.poster = config.base_url + config.poster_sizes[4] + movies[i].poster_path;
                parsedMovies.push(parsedMovie);
            }
          return parsedMovies;
        }

        function getUnreleasedMovies(){
          
          return $http.get(discoverMovieDBUrl+greaterDate+currentDate)
                  .then(setMovies)
                  .catch( () => {
                    console.log("Error en getUnreleasedMovies() en TMDBFactory");
                  });
                 
        }
        function searchMovies(query){
          console.log("Search movies");
          return $http.get(searchMovieDBUrl+query)
                  .then(setMovies)
                  .catch( () => {
                    console.log("Error en searchMovies() en TMDBFactory");
                  });
        }
        function getNextPage (pageNumber, currentPage,query){
          switch (currentPage){
            case 0  : return getByPagePopular(pageNumber);
                      break;                 
            case 1 : return getByPageUnreleased(pageNumber);
                     break;
            case 4 :console.log("next 20 results of " +query);
             return getByPageSearch(pageNumber,query);
                      break;
            default: return getByPagePopular(pageNumber);
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
          return $http.get(discoverMovieDBUrl+greaterDate+currentDate+pageStr+page)
                .then(setMovies)
                .catch( () => 
                { 
                  console.log("Error en getByPageUnreleased() en TMDBFactory");
                });
          }

        function getByPageSearch(page,query){
          return $http.get(searchMovieDBUrl+query+pageStr+page)
                .then(setMovies)
                .catch( () => {
                    console.log("Error en getByPageSearch() en TMDBFactory");
                  });
        }
     
                

    }
})();