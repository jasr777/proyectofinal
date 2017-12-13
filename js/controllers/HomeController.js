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
       $scope.pageNumber = 1;

        // Control de la página en la que se encuentra la web
        

        /* 0 => Descubrir
           1 => Proximamente
           2 => Favoritas
           3 => Para más tarde  
        */
        $scope.currentPage = 0; // Por defecto en discover
        $scope.totalCount = 0;

    	/***************************************************/

    	/* Scope functions */
    	$scope.getPopularFilms = getPopularFilms;
        $scope.getNextPopularFilmPage = getNextPopularFilmPage;
        $scope.getUnreleasedFilms = getUnreleasedFilms;
        $scope.getNextUnreleasedFilmPage = getNextUnreleasedFilmPage;
        $scope.getNextFilmPage = getNextFilmPage;


        activate();
        ////////////////
        function activate() {
            TheMovieDB.getConfig();
        	getPopularFilms();
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
            TheMovieDB.searchMovies(query)
            .then(setMovieResults)
            .catch( () => {
                console.log("Error en searchFilms() en HomeController");
            });
        }

        function setMovieResults(films){
            $scope.currentPage =2;
            $scope.totalCount = films.data.total_results;
            let filmsReceived = films.data.results.splice(0);
            $scope.films = TheMovieDB.parseMovies(filmsReceived);
        }

        function getNextFilmPage(){
            console.log($scope.currentPage);
            $scope.pageNumber++;
            TheMovieDB.getNextPage($scope.pageNumber,$scope.currentPage)
                      .then(addNextPage)
                      .catch( () => {
                        console.log("Error en getNextFilmPage() en HomeController");
                      });
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


    
    }
})();