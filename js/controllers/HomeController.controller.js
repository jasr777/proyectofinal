(function() {
    'use strict';
    angular
        .module('PeliculasEOI')
        .controller('HomeController', HomeController);
    HomeController.$inject = ['$scope','TheMovieDB','OMDB','$sce'];
    /* @ngInject */
    function HomeController($scope,TheMovieDB,OMDB, $sce) {

    	/* Scope variables */

    	$scope.films = [];
       $scope.pageNumber = 1;
       $scope.query ="";
        $scope.movie = {};
        $scope.modalFlag = false;
        // Control de la página en la que se encuentra la web
        

        /* 0 => Descubrir
           1 => Proximamente
           2 => Favoritas
           3 => Para más tarde  
        */
        $scope.currentPage = 0; // Por defecto en discover
        $scope.totalCount = 0;
        $scope.yearSlider  = {
            min : 1970,
            max : 2018,
            //max : Date = new Date().getFullYear(),
            options : {
                floor :1970,
                ceil:2018,
        //        onEnd : filterMoviesByYear($scope.yearSlider.min, $scope.yearSlider.max)
                onEnd : ()=> { getFilmsWithinYearRange($scope.yearSlider.min, $scope.yearSlider.max)}
            }
        }
        $scope.ratingSlider = {
            min : 0,
            max : 10,
            options : {
                floor: 0,
                ceil : 10,
                onEnd : () => {getFilmsWithinVoteRange($scope.ratingSlider.min, $scope.ratingSlider.max)}
            }
        }

        $scope.genres = [];


        

    	/***************************************************/

    	/* Scope functions */
    	$scope.getPopularFilms = getPopularFilms;
        $scope.getNextPopularFilmPage = getNextPopularFilmPage;
        $scope.getUnreleasedFilms = getUnreleasedFilms;
        $scope.getNextUnreleasedFilmPage = getNextUnreleasedFilmPage;
        $scope.getNextFilmPage = getNextFilmPage;
        $scope.searchFilms = searchFilms;
        $scope.getFilmsWithinYearRange = getFilmsWithinYearRange;
        $scope.getFilmsWithinVoteRange = getFilmsWithinVoteRange;
        $scope.resetFilter = resetFilter;
        $scope.generateGenreList = generateGenreList;
        $scope.getFilmsByGenreId =getFilmsByGenreId;
        $scope.getMovie = getMovie;
        $scope.toggleModalFlag = toggleModalFlag;


        activate();
        ////////////////
        function activate() {
            TheMovieDB.getConfig();
        	getPopularFilms();
            generateGenreList();

        }

        function getPopularFilms(){
            $scope.currentPage=0;

        	TheMovieDB.getPopularMovies()
        	.then(setPopularFilms)
        	.catch( () => {
                console.log("Ha habido un error en getPopularFilms en HomeController");
            });
        }

        function setPopularFilms(films){
            $scope.totalCount = films.data.total_results;
            let filmsReceived = films.data.results.splice(0);
            console.log("Films.results received in HomeController");
            console.log(filmsReceived);
            $scope.films = TheMovieDB.parseMovies(filmsReceived);
            console.log("After parsing, in HomeController");
            console.log($scope.films);
        }


        function getUnreleasedFilms(){
            $scope.currentPage = 1;
            TheMovieDB.getUnreleasedMovies()
            .then(setUnreleasedFilms)
            .catch( () => {
                console.log("Ha habido un error en getUnreleasedFilms() en HomeController");
            });
        }

        function setUnreleasedFilms(films){
            $scope.currentPage = 1;
            $scope.totalCount = films.data.total_results;

            let filmsReceived = films.data.results.splice(0);
            console.log("Unreleased films received before parsing");
            console.log(filmsReceived);
            $scope.films =TheMovieDB.parseMovies(filmsReceived);

        }

        function searchFilms (query){
            $scope.currentPage = 4;
            $scope.query=query;
            console.log("Searching " + query);
            console.log($scope.currentPage);
            TheMovieDB.searchMovies(query)
            .then(setMovieResults)
            .catch( () => {
                console.log("Error en searchFilms() en HomeController");
            });
        }

        function setMovieResults(films){
            $scope.currentPage =4;
            $scope.totalCount = films.data.total_results;
            let filmsReceived = films.data.results.splice(0);
            $scope.films = TheMovieDB.parseMovies(filmsReceived);
        }

        function getNextFilmPage(){
            console.log($scope.currentPage);
            $scope.pageNumber++;
            if($scope.currentPage < 4 ){
                console.log("not in search");
                TheMovieDB.getNextPage($scope.pageNumber,$scope.currentPage,"")
                          .then(addNextPage)
                          .catch( () => {
                            console.log("Error en getNextFilmPage() en HomeController");
                          });
            } else {
                console.log("in search");
                TheMovieDB.getNextPage($scope.pageNumber,$scope.currentPage,$scope.query)
                    .then(addNextPage)
                    .catch( () => {
                        console.log("Error en getNextFilmPage() en HomeController");
                    });
            }
        }



        function getNextPopularFilmPage(){
            
            TheMovieDB.getByPage($scope.pageNumber)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Error en getNextPopularFilmPage() en HomeController");
                      });
        }

        function getNextUnreleasedFilmPage(){
            $scope.unreleasedPageNumber++;
            TheMovieDB.getByPageUNreleased($scope.unreleasedPageNumber)
            .then(addNextPage)
            .catch( () => {
                console.log("Error en getNextUnreleasedFilmPage en HomeController");
            });

        }

        function addNextPage(films){
            console.log("setting next page ");
            console.log(films);
            if (films.data.page < films.data.total_pages){
                console.log("List of films to add ");
                console.log(films);
                let filmsReceived = TheMovieDB.parseMovies(films.data.results.splice(0));
                console.log(filmsReceived);
                // TODO : Investigar por que concat() no funciona bien en el ng-repeat

                for (var i = 0; i < filmsReceived.length; i++){
                    $scope.films.push(filmsReceived[i]);
                }
            } else {
            console.log("No hay más elementos");
            }
        }


        /* Filter functions*/

        function getFilmsWithinYearRange(min,max){
            TheMovieDB.getMoviesWithinYearRange(min,max)
                      .then(setFilteredFilms)
                      .catch("Ha habido un error en getFilmsWithinYearRange en HomeController");
        }

        function getFilmsWithinVoteRange(min,max){
            TheMovieDB.getMoviesWithinVoteRange(min,max)
                      .then(setFilteredFilms)
                      .catch("Ha habido un error en getFilmsWithinVoteRange en HomeController");
        }



        function resetFilter(){
            $scope.yearSlider.min = $scope.yearSlider.options.floor;
            $scope.yearSlider.max = $scope.yearSlider.options.ceil;
            $scope.ratingSlider.min = $scope.ratingSlider.options.floor;
            $scope.ratingSlider.max = $scope.ratingSlider.options.ceil;
            getPopularFilms();

        }
        function setFilteredFilms(response){
            $scope.films= response;
        }

        function generateGenreList(){
            console.log($scope.genres);
            TheMovieDB.getGenreList()
                      .then(setGenreList)
                      .catch( ()=> {
                        console.log("Ha habido un error en generateGenreList en HomeController");
                      })
            console.log($scope.genres);
        }
        function setGenreList(response){
            console.log("genres list :");
            console.log(response.data);
            $scope.genres = response.data.genres;
            console.log("genres en scope");
            console.log(typeof $scope.genres);

        }

        function getFilmsByGenreId(id){
            TheMovieDB.getMoviesbyGenreId(id)
                      .then(setFilteredFilms)
                      .catch( () => {
                        console.log("Ha habido un error en getFilmsByGenreId en HomeController");
                    })
        
        }


        /* Modal related functions : from Moviecontroller */



        

        ////////////////

        function toggleModalFlag(){
            if ($scope.modalFlag){
                $scope.modalFlag = false;
            } else {
                $scope.modalFlag=true;
            }

        }

        function getMovie(id){
            $scope.modalFlag = true;
            console.log("GETTING MOVIE WITH ID " + id);
            $scope.id = id;
            TheMovieDB.getMovie(id).then(setMovie).catch( () => {console.log("Ha Habdio un error en getMovie() en MovieController")});
        }
        function setMovie(response){
            console.log("SETTING MOVIE");
            console.log(response);
            $scope.movie = TheMovieDB.parseMovie(response);
            
            getRatings($scope.movie.imdb_id);
            getSimilars($scope.id);
            getTrailers($scope.id);
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