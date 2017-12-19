(function() {
    'use strict';
    angular
        .module('PeliculasEOI')
        .factory('TheMovieDB', TheMovieDB);
    TheMovieDB.$inject = ['$http'];
    /* @ngInject */
    function TheMovieDB($http) {


        /* Factory Variables  ------------*/

        // TODO: Constants file

        /* GET & URL  Strings ------------------------------*/
        var configurationMovieDbUrl = "https://api.themoviedb.org/3/configuration?api_key=70c6c34847ca16cd1a4326639172acd2";
        var api_key = "?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var movieMovieDbUrl ="https://api.themoviedb.org/3/movie/";
        var discoverMovieDBUrl="https://api.themoviedb.org/3/discover/movie?&api_key=70c6c34847ca16cd1a4326639172acd2";
        var searchMovieDBUrl = "https://api.themoviedb.org/3/search/movie?api_key=70c6c34847ca16cd1a4326639172acd2&query=";
        var genreMovieDBUrl = "https://api.themoviedb.org/3/genre/movie/list?api_key=70c6c34847ca16cd1a4326639172acd2&language=en-US";
        var sortByTitleDesc = "&sort_by=original_title.desc";
        var sortByTitleAsc = "&sort_by=original_title.asc";
        var sortByReleaseDesc="&sort_by=primary_release_date.desc";
        var sortByReleaseAsc="&sort_by=primary_release_date.asc";
        var sortByPopular = "&sort_by=popularity.desc";
        var sortByRatingDesc = "&sort_by=vote_average.desc";
        var sortByRatingAsc = "&sort_by=vote_average.asc";
        var popular = "&sort_by=popularity.desc";
        var lesserThanDate = "&primary_release_date.lte=";
        var pageStr = "&page=";
        var greaterThanDate ="&primary_release_date.gte=";
        var greaterThanVote ="&vote_average.gte=";
        var lesserThanVote ="&vote_average.lte=";
        var genresStr="&with_genres=";
        var youtubeEmbedUrl = "http://www.youtube.com/embed/";
        /*--------------------------------------------------------------*/
        var config = {};
        var currentDate = new Date().toISOString().substring(0,10);
        var totalCount = 0;
        var movie = {};


        var service = {
            getPopularMovies : getPopularMovies,
            getConfig : getConfig,
            parseMovies : parseMovies,
            getUnreleasedMovies : getUnreleasedMovies,
            searchMovies : searchMovies,
            getMovie : getMovie,
            parseMovie : parseMovie,
            getSimilarMovies : getSimilarMovies,
            parseSimilars : parseSimilars,
            getVideos : getVideos ,
            parseTrailers : parseTrailers,
            getMoviesWithinYearRange : getMoviesWithinYearRange,
            getMoviesWithinVoteRange : getMoviesWithinVoteRange,
            getGenreList : getGenreList,
            getMoviesbyGenreId : getMoviesbyGenreId,
            getMoviesSortedByName : getMoviesSortedByName,
            getMoviesSortedByRelease : getMoviesSortedByRelease,
            getMoviesSortedByRating : getMoviesSortedByRating,
            getNextPopularPage : getNextPopularPage,
            getNextUpcomingPage : getNextUpcomingPage,
            getNextSearchPage : getNextSearchPage,
            getNextYearFilterPage : getNextYearFilterPage,
            getNextRatingFilterPage : getNextRatingFilterPage,
            getNextGenreFilterPage : getNextGenreFilterPage
            // getByPagePopular : getByPagePopular,
            // getNextPage : getNextPage,


        };
        return service;
        ////////////////


        /* Getters  functions ------------------------------------------------------*/

        function getConfig() {
          return $http.get(configurationMovieDbUrl)
                  .then(setConfig)
                  .catch(() => {
                    console.log("Error en getConfig() en TMDBFactory");
                  });
        }


        function getGenreList(){
          return $http.get(genreMovieDBUrl)
                 .then(setGenreList)
                 .catch( () => {console.log("Ha habido un error en getGenreList en TMDB Factory")});

        }

        function getMovie(id){
            return $http.get(movieMovieDbUrl +id +"?"+api_key)
                  .then(setMovie)
                  .catch( () => {
                    console.log("Ha habido un error en getMovie(id) en TMDBFactory");
                  })

        }


        function getPopularMovies(){
          return $http.get(discoverMovieDBUrl+popular)
                .then(setMovies)
                .catch( () => {
                  console.log("Error en getPopularMovies() en TMDBFactory");
                });
        }



        // url : movieurl/ + id + /similar + ?apikey...
        function getSimilarMovies(id){
          console.log("fetching movies similar to movie id " +id);
          return $http.get(movieMovieDbUrl+id+"/similar"+api_key)
                  .then(setMovie)
                  .catch( () => {
                    console.log("Error en getSimilarMovies(id) en TMDBFactory");
                  });

        }


        function getUnreleasedMovies(){
          console.log("Getting upcoming");
          
          return $http.get(discoverMovieDBUrl+greaterThanDate+currentDate)
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

        

        function getNextPopularPage(page){
          console.log("getting popular films in page "+page);
          return $http.get(discoverMovieDBUrl + popular + pageStr + page)
                 .then(setMovies)
                  .catch( () => {
                    console.log("Error en getByPagePopular() en TMDBFactory");
                  });

        }

        function getNextUpcomingPage(page){
          return $http.get(discoverMovieDBUrl+greaterThanDate+currentDate+pageStr+page)
                .then(setMovies)
                .catch( () => 
                { 
                  console.log("Error en getByPageUnreleased() en TMDBFactory");
                });
          }

        function getNextSearchPage(page,query){
          return $http.get(searchMovieDBUrl+query+pageStr+page)
                .then(setMovies)
                .catch( () => {
                    console.log("Error en getByPageSearch() en TMDBFactory");
                  });
        }

        function getNextYearFilterPage(page,min,max){

          console.log(discoverMovieDBUrl + greaterThanDate + min + lesserThanDate + max+pageStr+page);
          return $http.get(discoverMovieDBUrl + greaterThanDate + min + lesserThanDate + max+pageStr+page)
                .then(setMovies)
                .catch(() => {
                  console.log("Error en getMoviesWithinVoteRange en TMDB Factory");
                })


        }

        function getNextRatingFilterPage(page,min,max){
            return $http.get(discoverMovieDBUrl + greaterThanVote + min + lesserThanVote + max + pageStr + page)
                      .then(setMovies)
                      .catch( () => {
                        console.log("Ha habido un error en getNextRatingFilter");
                      })

        }

        function getNextGenreFilterPage(page,genreId){
        return $http.get(discoverMovieDBUrl+genresStr+genreId+pageStr + page)
                   .then(setMovies)
                   .catch ( () => {
                    console.log("Error en getMoviesByGenreId en TMDBFactory");
                   })
        }

        function getVideos(id){
          return $http.get(movieMovieDbUrl+id+"/videos?"+api_key)
                  .then(setMovies)
                  .catch( () => {
                    console.log("Error en getVideos() en TMDBFactory");
                  })
        }



       function getMoviesWithinYearRange(min,max){
          console.log("Filtering movies from" + min + " " + max);
          return $http.get(discoverMovieDBUrl + greaterThanDate + min + lesserThanDate + max)
                .then(setFilter)
                .catch( () => {
                  console.log("Error en getMoviesWithinYearRange en TMDB Factory");
                })
        }

        function getMoviesWithinVoteRange(min,max){
          console.log("Filtering movies with votes between " + min + " " + max);
          return $http.get(discoverMovieDBUrl + greaterThanVote + min + lesserThanVote + max)
                .then(setFilter)
                .catch(() => {
                  console.log("Error en getMoviesWithinVoteRange en TMDB Factory");
                })
        }

        function getMoviesbyGenreId(id){
          console.log("Filtering movies with id : " + id);
          return $http.get(discoverMovieDBUrl+genresStr+id)
                 .then(setFilter)
                 .catch ( () => {
                  console.log("Error en getMoviesByGenreId en TMDBFactory");
                 })
        }


        /* -------------------------------------------------------------------------*/

        /* Set functions -----------------------------------------------------------*/
        
        function setConfig(response){
          console.log("Configuration object received in TheMovieDB factory");
          config = response.data.images;
          console.log(config);
        }

        function setGenreList(response){
          return response;
        }

        function setMovie(response){
          return response.data;

        }

        function setMovies(response){          
          console.log("received response in TMDBFactory");
          //totalCount = films.data.total_results;
          console.log(response);
          return response;
        }

        function setFilter(response){
          return response;
        }

        /* -------------------------------------------------------------------------*/


        /* Parse functions  -------------------------------------------------------*/
        function parseTrailers(trailers){

          console.log("parsing trailers");
          console.log(trailers);
          let auxTrailers = trailers
          console.log(auxTrailers);
          let parsedTrailers = [];
          for (var i = 0; i < auxTrailers.length;i++){
            console.log("en el for parsiando");
            console.log(auxTrailers[i].type);
            if(auxTrailers[i].type="Trailer"){
              console.log("encontre trailer");
              let trailer = Object.assign({},auxTrailers[i]);
              
              return youtubeEmbedUrl + auxTrailers[i].key;
              
            } 
          }
          return parsedTrailers;
        }

        function parseSimilars(similars){
          console.log("parse similars");
          console.log(similars);
          let parsedSimilars = [];       
          for (var i = 0; i < similars.length; i++){
            let thumbnail = Object.assign({},similars[i]);

            thumbnail.url  = config.base_url + config.logo_sizes[2] +similars[i].poster_path;
            parsedSimilars.push(thumbnail);
            thumbnail = {};
          }
          console.log("similars parsed : ");
          console.log(parsedSimilars);
          return parsedSimilars;

        }

        function parseMovies(movies){

          let parsedMovies = [];
            for(var i = 0; i < movies.length; i++){
                let parsedMovie = {};
                parsedMovie = Object.assign({}, movies[i]);

                parsedMovie.fallback_poster = "img/generic-film.jpg";
                parsedMovie.regular_poster =config.base_url + config.poster_sizes[3] + movies[i].poster_path;
                parsedMovie.poster = config.base_url + config.poster_sizes[4] + movies[i].poster_path;
                console.log(parsedMovie);
                parsedMovies.push(parsedMovie);
            }
          return parsedMovies;
        }


        function parseMovie (movie){
         
          let parsedMovie = Object.assign({},movie);          
          let parsedGenres = [];


          parsedMovie.year = new Date(movie.release_date).getFullYear();
          parsedMovie.full_poster = config.base_url + config.poster_sizes[4] + movie.poster_path;
          
            // FUTURE: investiga el .map 
          for (var i = 0; i < movie.genres.length;i++){            
            parsedGenres.push (movie.genres[i].name);
          }
          parsedMovie.duration = formatMinutes(movie.runtime);

          return parsedMovie;
        }
        /* ------------------------------------------------------------------*/

        /* Sorting functions ------------------------------------------------*/



        function getMoviesSortedByName(mode){
          // mode : true => ascendente , false => descendente
          if ( mode ) {
          return $http.get( discoverMovieDBUrl+sortByTitleAsc)
                      .then(setMovies)
                      .catch( () => {
                        console.log("Ha habido un error en getMoviesSortedByName en TMDBFactory");

                      });
          } else {

          return $http.get( discoverMovieDBUrl+sortByTitleDesc)
                      .then(setMovies)
                      .catch( () => {
                        console.log("Ha habido un error en getMoviesSortedByName en TMDBFactory");

                      });
          }

        }


        
        function getMoviesSortedByRelease(mode){
          console.log(mode);
          if ( mode ){
            return $http.get( discoverMovieDBUrl+sortByReleaseAsc)
                                  .then(setMovies)
                                  .catch( () => {
                                    console.log("Ha habido un error en getMoviesSortedBYRelease en TMDBFactory");

                                  });
          } else {
            return $http.get( discoverMovieDBUrl+sortByReleaseDesc)
                                  .then(setMovies)
                                  .catch( () => {
                                    console.log("Ha habido un error en getMoviesSortedBYRelease en TMDBFactory");

                                  });

          }
        }


        /* Se puede arreglar  como lo hago con el slider de valoracion*/
        function getMoviesSortedByRating(mode){
          if ( mode ){
            return $http.get(discoverMovieDBUrl+sortByRatingAsc)
                        .then(setMovies)
                        .catch ( () => {
                          console.log("Ha habido un error en getMoviesSortedByRating en TMDBFactory");
                        });
        } else {
            return $http.get(discoverMovieDBUrl+sortByRatingDesc)
                                  .then(setMovies)
                                  .catch ( () => {
                                    console.log("Ha habido un error en getMoviesSortedByRating en TMDBFactory");
                                  });

        }
        }


        /* -------------------------------------------------------------------*/


        /* Auxiliary functions */
        function formatMinutes (minutes){
          let time = new Date(null);
          time.setMinutes(minutes);
          let duration = time.toISOString().substring(12,16);
          return duration.replace(":", "h ") +"m";


        }

    }
})();