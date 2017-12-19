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
        $scope.genres = [];
        $scope.movie = {};
        $scope.pageNumber = 1;
        $scope.query ="";        
        $scope.modalFlag = false;
        $scope.genreId =0;       
        $scope.currentPage = 0; 
        $scope.totalCount = 0;
        $scope.contentFlag= false;
        $scope.elements = 20;
        /* Sliders -----------------------------------------*/
        $scope.yearSlider  = {
            min : 1970,
            max : 2018,
            options : {
                floor :1970,
                ceil:2018,
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
        /* ---------------------------------------------------*/
       


        

    	/***************************************************/

    	/* Scope functions */
    	$scope.getPopularFilms = getPopularFilms;
        $scope.getUnreleasedFilms = getUnreleasedFilms;
        $scope.searchFilms = searchFilms;
        $scope.getFilmsWithinYearRange = getFilmsWithinYearRange;
        $scope.getFilmsWithinVoteRange = getFilmsWithinVoteRange;
        $scope.resetFilter = resetFilter;
        $scope.generateGenreList = generateGenreList;
        $scope.getFilmsByGenreId =getFilmsByGenreId;
        $scope.getMovie = getMovie;
        $scope.toggleModalFlag = toggleModalFlag;
        $scope.setPageMode = setPageMode;

         
        /* REFACTOR :  Unused / To be implemented  
        $scope.getNextPopularFilmPage = getNextPopularFilmPage;
        $scope.getNextUnreleasedFilmPage = getNextUnreleasedFilmPage;
        $scope.getNextFilmPage = getNextFilmPage;
        $scope.sortByName = sortByName;
        $scope.sortByReleaseDate = sortByReleaseDate;
        $scope.sortByRating = sortByRating;
        */
        activate();

        ////////////////
        function activate() {
            TheMovieDB.getConfig();
        	getPopularFilms();
            generateGenreList();

        }

        /******************************************************************************/
        /*                       HOME VIEW CONTROLLER FUNCTIONS                       */
        /******************************************************************************/

        /* Get functions --------------------------------------------------------*/

        function getPopularFilms(){
            $scope.currentPage=0;
            $scope.searchQuery="";
            $scope.pageNumber = 1;

        	TheMovieDB.getPopularMovies()
        	.then(setPopularFilms)
        	.catch( () => {
                console.log("Ha habido un error en getPopularFilms en HomeController");
            });
                        $scope.yearSlider.min = $scope.yearSlider.options.floor;
            $scope.yearSlider.max = $scope.yearSlider.options.ceil;
            $scope.ratingSlider.min = $scope.ratingSlider.options.floor;
            $scope.ratingSlider.max = $scope.ratingSlider.options.ceil;

        }
        function getUnreleasedFilms(){
            $scope.currentPage = 1;
            $scope.searchQuery="";
            $scope.pageNumber = 1;


            TheMovieDB.getUnreleasedMovies()
            .then(setUnreleasedFilms)
            .catch( () => {
                console.log("Ha habido un error en getUnreleasedFilms() en HomeController");
            });
                        $scope.yearSlider.min = $scope.yearSlider.options.floor;
            $scope.yearSlider.max = $scope.yearSlider.options.ceil;
            $scope.ratingSlider.min = $scope.ratingSlider.options.floor;
            $scope.ratingSlider.max = $scope.ratingSlider.options.ceil;

        }
        function searchFilms (query){
            $scope.pageNumber = 1;

            if (query.length > 0){
            $scope.currentPage = 2;
            $scope.query=query;
            console.log("Searching " + query);
            console.log($scope.currentPage);
            TheMovieDB.searchMovies(query)
            .then(setMovieResults)
            .catch( () => {
                console.log("Error en searchFilms() en HomeController");
            });
        } else{
            getPopularFilms();

        }
            $scope.yearSlider.min = $scope.yearSlider.options.floor;
            $scope.yearSlider.max = $scope.yearSlider.options.ceil;
            $scope.ratingSlider.min = $scope.ratingSlider.options.floor;
            $scope.ratingSlider.max = $scope.ratingSlider.options.ceil;

        }
        /* Filter getters*/

        function getFilmsWithinYearRange(min,max){
            $scope.searchQuery="";
            $scope.pageNumber = 1;

            $scope.currentPage = 3;
            TheMovieDB.getMoviesWithinYearRange(min,max)
                      .then(setFilteredFilms)
                      .catch("Ha habido un error en getFilmsWithinYearRange en HomeController");
            $scope.ratingSlider.min = $scope.ratingSlider.options.floor;
            $scope.ratingSlider.max = $scope.ratingSlider.options.ceil;


        }

        function getFilmsWithinVoteRange(min,max){
            $scope.searchQuery="";
            $scope.pageNumber = 1;

            $scope.currentPage =4;
            TheMovieDB.getMoviesWithinVoteRange(min,max)
                      .then(setFilteredFilms)
                      .catch("Ha habido un error en getFilmsWithinVoteRange en HomeController");
            $scope.yearSlider.min = $scope.yearSlider.options.floor;
            $scope.yearSlider.max = $scope.yearSlider.options.ceil;

        }

        function getFilmsByGenreId(id){
            $scope.searchQuery="";
            $scope.pageNumber = 1;


            $scope.currentPage = 5;
            $scope.genreId = id;
            TheMovieDB.getMoviesbyGenreId(id)
                      .then(setFilteredFilms)
                      .catch( () => {
                        console.log("Ha habido un error en getFilmsByGenreId en HomeController");
                    });
            $scope.yearSlider.min = $scope.yearSlider.options.floor;
            $scope.yearSlider.max = $scope.yearSlider.options.ceil;
            $scope.ratingSlider.min = $scope.ratingSlider.options.floor;
            $scope.ratingSlider.max = $scope.ratingSlider.options.ceil;
        
        }


        /*-------------------------------------------------------------------*/
        /* Set functions ----------------------------------------------------*/

        function setPopularFilms(films){
            $scope.totalCount = films.data.total_results;
            let filmsReceived = films.data.results.splice(0);
            console.log("Films.results received in HomeController");
            console.log(filmsReceived);
            $scope.films = TheMovieDB.parseMovies(filmsReceived);
            $scope.elements = $scope.films.length;
            console.log("ELEMENTS VALUE " + $scope.elements);
            console.log("After parsing, in HomeController");
            console.log($scope.films);
        }



        function setUnreleasedFilms(films){
            $scope.totalCount = films.data.total_results;

            let filmsReceived = films.data.results.splice(0);
            console.log("Unreleased films received before parsing");
            console.log(filmsReceived);
            $scope.films =TheMovieDB.parseMovies(filmsReceived);
            $scope.elements = $scope.films.length;
            console.log("ELEMENTS VALUE " + $scope.elements);

        }


        function setMovieResults(films){

            $scope.totalCount = films.data.total_results;
            let filmsReceived = films.data.results.splice(0);            
            $scope.films = TheMovieDB.parseMovies(filmsReceived);
            $scope.elements = $scope.films.length;
            console.log("ELEMENTS VALUE " + $scope.elements);
        }  


        /* Filter Setters */

        function setFilteredFilms(response){

            $scope.totalCount = response.data.total_results;
            $scope.films= TheMovieDB.parseMovies(response.data.results);
            $scope.elements = $scope.films.length;
            console.log("ELEMENTS VALUE " + $scope.elements);
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

        /*Filter Resetter */
        function resetFilter(){
            $scope.yearSlider.min = $scope.yearSlider.options.floor;
            $scope.yearSlider.max = $scope.yearSlider.options.ceil;
            $scope.ratingSlider.min = $scope.ratingSlider.options.floor;
            $scope.ratingSlider.max = $scope.ratingSlider.options.ceil;
            getPopularFilms();


        }

        /* Result pagination functions ------------------------------*/

        /*  Valores de currentPage : 

            Descubrir : 0 
            Proximamente : 1
            Busqueda : 2
            Filtro por año : 3
            FIltro por valoracion : 4
            Filtro por genero : 5
            Orden por nombre ascendente : 6
            Orden por nombre descendente : 7
            Orden por fecha de salida Asc : 8
            Orden por fecha de salida Desc : 9
            Orden por valoracion de usuario asc : 10
            Orden por valoracion de usuario  desc :11


                                              */



        function setPageMode(currentPage,query,min,max,genreId){
            console.log("setting page mode");
            switch (currentPage){
                // case x : return 0 nextPage
                case 0 : return getNextPopular();
                         break;
                case 1 : return getNextUpcoming();
                         break;
                case 2 : return getNextSearch(query);
                         break;
                case 3 : return getNextYearFilter(min,max);
                         break;
                case 4 : return getNextRatingFilter(min,max);
                         break;
                case 5 : return getNextGenreFilter();
                         break;
                /* TODO: Not Implemented 
                case 6 : return getNextOrderedByNameAsc();
                         break;
                case 7 : return getNextOrderedByNameDesc();
                         break;
                case 8 : return getNextOrderedByReleasedAsc();
                         break;
                case 9 : return getNextOrderedByReleaseDesc();
                         break;
                case 10 : return getNextOrderedByRatingAsc();
                         break;
                case 11 : return getNextOrderedByRatingDesc();
                         break;

                */
            }

        }

        /* GetNextPage Functions --- */
        function getNextPopular(){
            $scope.pageNumber++;
            TheMovieDB.getNextPopularPage($scope.pageNumber)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }

        function getNextUpcoming(){
            $scope.pageNumber++;
            TheMovieDB.getNextUpcomingPage($scope.pageNumber)
                      .then(addNextPage)
                      .catch ( () => {
                        console.log("Ha habido un error en getNextUpcoming en HC");
                      })
        }


        function getNextSearch(query){
            $scope.pageNumber++;
            TheMovieDB.getNextSearchPage($scope.pageNumber, query)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextSearch en HC");
                      })
        }

        function getNextYearFilter(min,max){
            $scope.pageNumber++;
            TheMovieDB.getNextYearFilterPage($scope.pageNumber,min,max)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextYearFilter");
                      })

        }


        function getNextRatingFilter(min,max){
            $scope.pageNumber++;
            TheMovieDB.getNextRatingFilterPage($scope.pageNumber, min,max)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextRatingFilter");
                      })

        }

        function getNextGenreFilter(){
            $scope.pageNumber++;
            TheMovieDB.getNextGenreFilterPage($scope.pageNumber,$scope.genreId)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextGenreFilter");
                      })

        }
        /* TODO : To be implemented

        function getNextOrderedByNameAsc() {
            $scope.pageNumber++;
            TheMovieDB.getNextOrderedByNameAscPage($scope.pageNumber)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }

        function getNextOrderedByNameDesc(){
            $scope.pageNumber++;
            TheMovieDB.getNextOrderedByNameDescPage($scope.pageNumber)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }

        function getNextOrderedByReleaseAsc(){
            $scope.pageNumber++;
            TheMovieDB.getNextOrderedByReleaseAscPage($scope.pageNumber)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }

        function getNextOrderedByReleaseDesc(){
            $scope.pageNumber++;
            TheMovieDB.getNextOrderedByReleaseDescPage($scope.pageNumber)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }
        function getNextOrderedByRatingAsc(){
            $scope.pageNumber++;
            TheMovieDB.getNextOrderdByRatingAscPage($scope.pageNumber)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }
        function getNextOrderedByRatingDesc(){
            $scope.pageNumber++;
            TheMovieDB.getNextOrderedByRatingDescPage($scope.pageNumber)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }
        */

        /* Page Setter */

        function addNextPage(films){
            console.log("setting next page ");
            console.log(films);
            console.log("SCOPE PAGE NUMBER");
            console.log($scope.pageNumber);
            console.log("---------FILM DATA PAGE ----------");
            console.log(films.data.page);
            console.log(films.data.total_pages);

            if (films.data.page <= films.data.total_pages){
                console.log("List of films to add ");
                console.log(films);
                let filmsReceived = TheMovieDB.parseMovies(films.data.results.splice(0));
                console.log(filmsReceived);
                // TODO : Investigar por que concat() no funciona bien en el ng-repeat

                for (var i = 0; i < filmsReceived.length; i++){
                        $scope.films.push(filmsReceived[i]);
                        $scope.elements++
                        console.log("ELEMENTS VALUE  EN NEXT PAGE" + $scope.elements);
                        if($scope.elements == $scope.totalCount){
                            $scope.contentFlag=true;
                            break;
                        }
                }
            } else {
                    $scope.contentFlag = true;
                    console.log("No hay más elementos");
            }
        }
    



/* TODO : Refactor => Unused/Unimplemented
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

*/

/*
        function getNextUnreleasedFilmPage(){
            $scope.unreleasedPageNumber++;
            TheMovieDB.getByPageUNreleased($scope.unreleasedPageNumber)
            .then(addNextPage)
            .catch( () => {
                console.log("Error en getNextUnreleasedFilmPage en HomeController");
            });

        }


/* TODO : TO BE IMPLEMENTED */
        /* Sorting functions */

        // Que ordene la API
/*
        function sortByName(mode){
            mode ? $scope.currentPage = 6 : $scope.currentPage = 7;
            TheMovieDB.getMoviesSortedByName(mode)
                      .then(setMoviesSorted)
                      .catch( () => {
                        console.log("Ha habido un error en sortByName() en HomeController");
                      });
         

        }

        function setMoviesSorted(response){
            $scope.films = TheMovieDB.parseMovies(response.data.results);
        }


        function sortByReleaseDate(mode){
             mode ? $scope.currentPage = 8 : $scope.currentPage = 9;

            TheMovieDB.getMoviesSortedByRelease(mode)
                      .then(setMoviesSorted)
                      .catch( () => {
                        console.log("Ha habido un error en sortByReleaseDate");
                      })
         
            }
        function sortByRating(mode){
                mode ? $scope.currentPage = 10 : $scope.currentPage = 11;

            TheMovieDB.getMoviesSortedByRating(mode)
                      .then(setMoviesSorted)
                      .catch ( () => {
                        console.log("Ha habido un error en sortByRating() en HomeController");
                      })
         
            }
*/     

        

        ///////////////////////////////////////////////////////////////////////////////////

        /******************************************************************************/
        /*                       MODAL VIEW CONTROLLER FUNCTIONS                      */
        /******************************************************************************/



        /* Flag toggle functions --------------------------------------- */
        function toggleModalFlag(){
            if ($scope.modalFlag){
                $scope.modalFlag = false;
            } else {
                $scope.modalFlag=true;
            }

        }
        /*---------------------------------------------------------------*/



        /* Getters ------------------------------------------------------*/
        function getMovie(id){
            $scope.modalFlag = true;
            console.log("GETTING MOVIE WITH ID " + id);
            $scope.id = id;
            TheMovieDB.getMovie(id).then(setMovie).catch( () => {console.log("Ha Habdio un error en getMovie() en MovieController")});
        }

        function getRatings(imdbid){
            OMDB.getMovieRating($scope.movie.imdb_id)
                .then(setRatings)
                .catch("Ha habido un error en getRatings en MovieController");
        }


        function getSimilars(id){
            TheMovieDB.getSimilarMovies(id)
                       .then(setSimilar)
                       .catch( () => {
                        console.log("Ha habido un error en getSimilars(id) en MovieController");
                       })

        }
        function getTrailers(id){
            console.log("Getting trailers for id " + id);
            TheMovieDB.getVideos(id)
                      .then(setTrailers)
                      .catch( () => {
                        console.log("Error en getTrailers() en MovieController");
                      });

        }
        /*--------------------------------------------------------------------------------*/
        /* Setters -----------------------------------------------------------------------*/


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

        function setRatings(response){ 
            let ratings = response.data.Ratings;            
            $scope.movie.ratings = formatRatings(ratings);
        }


        function setSimilar(response){
            $scope.movie.similars = TheMovieDB.parseSimilars( response.results);

        }

        function setTrailers(response){
            console.log("Trailers received in MovieController");
            console.log(response.data.results);   
           // let trailers = TheMovieDB.parseTrailers(response.data.results);
           console.log("TRAILER QUE SCEO");
           console.log(TheMovieDB.parseTrailers(response.data.results));
            $scope.movie.trailer = $sce.trustAsResourceUrl(TheMovieDB.parseTrailers(response.data.results));
            console.log("Trailers after parsing : ");
            console.log($scope.movie.trailer);
            //$scope.movie.trailers = TheMovieDB.parseTrailers()

        }

        /*----------------------------------------------------------------------------*/
        /* Formatting functions ------------------------------------------------------*/

        function formatRatings(ratings){
            let parsedRatings = ratings;
            parsedRatings[0] = parsedRatings[0].Value.replace("/10","");
            parsedRatings[1] = parsedRatings[1].Value;
            parsedRatings[2] = parsedRatings[2].Value.replace("/100","");           
            return parsedRatings;
        }
        /*----------------------------------------------------------------------------*/
        /* Auxiliary functions -------------------------------------------------------*/


    }
})();