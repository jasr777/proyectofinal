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
        $scope.elements =0;
        $scope.genreFilter ='';

        $scope.filterToggle = true;
        /* Sliders -----------------------------------------*/

        $scope.yearSlider  = {
            min : 1970,
            max : 2018,
            options : {
                floor :1970,
                ceil:2018,
                onChange : () => {$scope.genreFilter=''},
                onEnd : ()=> { getFilmsByFilter($scope.yearSlider.min, $scope.yearSlider.max,$scope.ratingSlider.min,$scope.ratingSlider.max,$scope.genreFilter)}
            }
        }
        $scope.ratingSlider = {
            min : 0,
            max : 10,
            options : {
                floor: 0,
                ceil : 10,
                onChange : () => {$scope.genreFilter=''},
                onEnd : () => {getFilmsByFilter($scope.yearSlider.min, $scope.yearSlider.max,$scope.ratingSlider.min,$scope.ratingSlider.max,$scope.genreFilter)}
            }
        }
        /* ---------------------------------------------------*/       

    	/***************************************************/

    	/* Scope functions */
    	$scope.getPopularFilms = getPopularFilms;
        $scope.getUnreleasedFilms = getUnreleasedFilms;
        $scope.searchFilms = searchFilms;
        $scope.resetFilter = resetFilter;
        $scope.generateGenreList = generateGenreList;
        $scope.getFilmsByGenreId =getFilmsByGenreId;
        $scope.getMovie = getMovie;
        $scope.toggleModalFlag = toggleModalFlag;
        $scope.setPageMode = setPageMode;         
        $scope.sortByName = sortByName;
        $scope.sortByReleaseDate = sortByReleaseDate;
        $scope.sortByRating = sortByRating;
        $scope.getFilmsByFilter = getFilmsByFilter;
        
        activate();

        /////////////////////////////////////////

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
            $scope.filterToggle = true;

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
            $scope.filterToggle = false;
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
            $scope.filterToggle=false;
            $scope.pageNumber = 1;

            if (query.length > 0){
            $scope.currentPage = 2;
            $scope.query=query;
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




        function getFilmsByYearVoteRange(minYear, maxYear, minvVote, maxVote,genreId){
            $scope.searchQuery="";
            $scope.pageNumber = 1;
            $scope.currentPage = 3;

            TheMovieDB.getMoviesByYearVote(minYear, maxYear, minvVote, maxVote,genreId)
                      .then(setFilteredFilms)
                      .catch(() => {
                        "Ha habido un error en getFilmsByYearVoteRange"
                      });
        }


        function getFilmsByGenreId(id){
            console.log("Genre id : " + id);
            $scope.searchQuery="";
            $scope.pageNumber = 1;
            $scope.currentPage = 5;
            $scope.genreId = id;
            $scope.genreFilter = id;
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
        function getFilmsByFilter(minYear,maxYear,minVote,maxVote,genreId){
            $scope.currentPage =5;
            $scope.genreFilter = genreId;
            $scope.pageNumber =1;
            $scope.genreFilter = genreId;
            TheMovieDB.getMoviesByFilter(minYear,maxYear,minVote,maxVote,genreId)
                      .then(setFilteredFilms)
                      .catch(() => {console.log("Ha habido un error en getFilmsByFilter")});
        }



        /*-------------------------------------------------------------------*/
        /* Set functions ----------------------------------------------------*/

        function setPopularFilms(films){
            $scope.totalCount = films.data.total_results.toLocaleString();
            let filmsReceived = films.data.results.splice(0);
            $scope.films = TheMovieDB.parseMovies(filmsReceived);
            $scope.elements = $scope.films.length;
        }



        function setUnreleasedFilms(films){
            $scope.totalCount = films.data.total_results.toLocaleString();

            let filmsReceived = films.data.results.splice(0);
            $scope.films =TheMovieDB.parseMovies(filmsReceived);
            $scope.elements = $scope.films.length;

        }


        function setMovieResults(films){

            $scope.totalCount = films.data.total_results.toLocaleString();
            let filmsReceived = films.data.results.splice(0);            
            $scope.films = TheMovieDB.parseMovies(filmsReceived);
            $scope.elements = $scope.films.length;

        }  


        /* Filter Setters */

        function setFilteredFilms(response){

            $scope.totalCount = response.data.total_results.toLocaleString();
            $scope.films= TheMovieDB.parseMovies(response.data.results);
            $scope.elements = $scope.films.length;
        }

        function generateGenreList(){

            TheMovieDB.getGenreList()
                      .then(setGenreList)
                      .catch( ()=> {
                        console.log("Ha habido un error en generateGenreList en HomeController");
                      })
        }
        function setGenreList(response){
            $scope.genres = response.data.genres;

        }

        /*Filter Resetter */
        function resetFilter(){
            $scope.yearSlider.min = $scope.yearSlider.options.floor;
            $scope.yearSlider.max = $scope.yearSlider.options.ceil;
            $scope.ratingSlider.min = $scope.ratingSlider.options.floor;
            $scope.ratingSlider.max = $scope.ratingSlider.options.ceil;
            $scope.genreFilter = '';
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



        function setPageMode(currentPage,query,minYear,maxYear,minVote,maxVote,genreId){
            switch (currentPage){
                // case x : return 0 nextPage
                case 0 : return getNextPopular();
                         break;
                case 1 : return getNextUpcoming();
                         break;
                case 2 : return getNextSearch(query);
                         break;
                case 3 : return getNextByFilter(minYear,maxYear,minVote,maxVote);
                         break;
                case 6 : return getNextOrderedByNameAsc(minYear,maxYear,minVote,maxVote);
                         break;
                case 7 : return getNextOrderedByNameDesc(minYear,maxYear,minVote,maxVote);
                         break;
                case 8 : return getNextOrderedByReleaseAsc(minYear,maxYear,minVote,maxVote);
                         break;
                case 9 : return getNextOrderedByReleaseDesc(minYear,maxYear,minVote,maxVote);
                         break;
                case 10 : return getNextOrderedByRatingAsc(minYear,maxYear,minVote,maxVote);
                         break;
                case 11 : return getNextOrderedByRatingDesc(minYear,maxYear,minVote,maxVote);
                         break;

            }

        }

        /* GetNextPage Functions --- */

        function getNextByFilter(minYear,maxYear,minVote,maxVote){
            $scope.pageNumber++;
            console.log("GET NEXT BY FILTER");
            console.log($scope.genreFilter);
            TheMovieDB.getNextFilterPage($scope.pageNumber, minYear,maxYear,minVote,maxVote,$scope.genreFilter)
                      .then(addNextPage)
                      .catch(()=>{
                        console.log("Ha habido un erro en getNextByFilter en HC");
                      })
        }
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

        function getNextYearVoteFilter(minYear,maxYear,minVote,maxVote){
            $scope.pageNumber++;
            TheMovieDB.getNextYearVoteFilter($scope.pageNumber,minYear,maxYear,minVote,maxVote)
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

        function getNextOrderedByNameAsc(minYear,maxYear,minVote,maxVote) {
            $scope.pageNumber++;
            TheMovieDB.getNextMoviesSortedByName($scope.pageNumber,true,minYear,maxYear,minVote,maxVote,$scope.genreFilter)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }

        function getNextOrderedByNameDesc(minYear,maxYear,minVote,maxVote){
            $scope.pageNumber++;
            TheMovieDB.getNextMoviesSortedByName($scope.pageNumber,false,minYear,maxYear,minVote,maxVote,$scope.genreFilter)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }

        function getNextOrderedByReleaseAsc(minYear,maxYear,minVote,maxVote){
            $scope.pageNumber++;
            TheMovieDB.getNextMoviesSortedByRelease($scope.pageNumber,true,minYear,maxYear,minVote,maxVote,$scope.genreFilter)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }

        function getNextOrderedByReleaseDesc(minYear,maxYear,minVote,maxVote){
            $scope.pageNumber++;
            TheMovieDB.getNextMoviesSortedByRelease($scope.pageNumber,false,minYear,maxYear,minVote,maxVote,$scope.genreFilter)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }
        function getNextOrderedByRatingAsc(minYear,maxYear,minVote,maxVote){
            $scope.pageNumber++;
            TheMovieDB.getNextMoviesSortedByRating($scope.pageNumber,true,minYear,maxYear,minVote,maxVote,$scope.genreFilter)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }
        function getNextOrderedByRatingDesc(minYear,maxYear,minVote,maxVote){
            $scope.pageNumber++;
            TheMovieDB.getNextMoviesSortedByRating($scope.pageNumber,false,minYear,maxYear,minVote,maxVote,$scope.genreFilter)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Ha habido un error en getNextPopular en HC");
                      })

        }

        /* Page Setter */

        function addNextPage(films){

            if (films.data.page <= films.data.total_pages){
                let filmsReceived = TheMovieDB.parseMovies(films.data.results.splice(0));
                // TODO : Investigar por que concat() no funciona bien en el ng-repeat

                for (var i = 0; i < filmsReceived.length; i++){
                        $scope.films.push(filmsReceived[i]);
                        $scope.elements++
                        if($scope.elements == $scope.totalCount){
                            $scope.contentFlag=true;
                            break;
                        }
                }
            } else {
                    $scope.contentFlag = true;
            }
        }
    



        /* Sorting functions */

        function sortByName(mode,yearMin,yearMax,voteMin,voteMax){
            $scope.searchQuery="";
            console.log($scope.genreFilter);
            mode ? $scope.currentPage = 6 : $scope.currentPage = 7;
            TheMovieDB.getMoviesSortedByName(mode,yearMin,yearMax,voteMin,voteMax,$scope.genreFilter)
                      .then(setMoviesSorted)
                      .catch( () => {
                        console.log("Ha habido un error en sortByName() en HomeController");
                      });
        }

       

        function sortByReleaseDate(mode,yearMin,yearMax,voteMin,voteMax){
            $scope.searchQuery="";
            mode ? $scope.currentPage = 8 : $scope.currentPage = 9;

            TheMovieDB.getMoviesSortedByRelease(mode,yearMin,yearMax,voteMin,voteMax,$scope.genreFilter)
                      .then(setMoviesSorted)
                      .catch( () => {
                        console.log("Ha habido un error en sortByReleaseDate");
                      })
         
            }
        function sortByRating(mode,yearMin,yearMax,voteMin,voteMax){
                mode ? $scope.currentPage = 10 : $scope.currentPage = 11;

            TheMovieDB.getMoviesSortedByRating(mode,yearMin,yearMax,voteMin,voteMax,$scope.genreFilter)
                      .then(setMoviesSorted)
                      .catch ( () => {
                        console.log("Ha habido un error en sortByRating() en HomeController");
                      })
         
            }
   
        function setMoviesSorted(response){
            $scope.totalCount = response.data.total_results.toLocaleString();
            $scope.elements = response.data.results.length;
            $scope.films = TheMovieDB.parseMovies(response.data.results);
        }

        

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
            TheMovieDB.getVideos(id)
                      .then(setTrailers)
                      .catch( () => {
                        console.log("Error en getTrailers() en MovieController");
                      });

        }
        /*--------------------------------------------------------------------------------*/
        /* Setters -----------------------------------------------------------------------*/


        function setMovie(response){
            $scope.movie = TheMovieDB.parseMovie(response);            
            getRatings($scope.movie.imdb_id);
            getSimilars($scope.id);
            getTrailers($scope.id);
        }

        function setRatings(response){ 
            let ratings = response.data.Ratings;            
            $scope.movie.ratings = formatRatings(ratings);
        }


        function setSimilar(response){
            $scope.movie.similars = TheMovieDB.parseSimilars( response.results);

        }

        function setTrailers(response){
            if (response.data.results.length > 0 ){
                $scope.movie.trailer = $sce.trustAsResourceUrl(TheMovieDB.parseTrailers(response.data.results));
            } else {
                return;
            }

        }

        /*----------------------------------------------------------------------------*/
        /* Formatting functions ------------------------------------------------------*/

        function formatRatings(ratings){
            let parsedRatings = [];

            if (ratings == undefined){
                parsedRatings[0] = "N/A";
                parsedRatings[1] = "N/A"; 
                parsedRatings[2] = "N/A"; 

            } else {

                if(ratings.length > 0){
                    let auxRatings = [];
                    for (var i = 0; i < ratings.length;i++){
                        auxRatings.push(ratings[i]);
                    }

                    for (var i = 0; i < auxRatings.length;i++){
                        if (auxRatings[i].Source == "Internet Movie Database"){
                            parsedRatings[0] = auxRatings[i].Value.replace("/10","");                                                

                        }

                        if(auxRatings[i].Source == "Rotten Tomatoes"){
                            parsedRatings[1] = auxRatings[i].value;
                         

                        }

                        if(auxRatings[i].Source == "Metacritic"){
                            parsedRatings[2] = auxRatings[i].Value.replace("/100","%");
                        

                        }
                    }


                    for (var i = 0; i < parsedRatings.length;i++){
                        if(!parsedRatings[i]){
                            parsedRatings[i] = "N/A";
                        }

                    }
                } else {
                parsedRatings[0] = "N/A";
                parsedRatings[1] = "N/A"; 
                parsedRatings[2] = "N/A"; 


                }


            return parsedRatings;
        }
    }
        /*----------------------------------------------------------------------------*/
        /* Auxiliary functions -------------------------------------------------------*/


    }
})();