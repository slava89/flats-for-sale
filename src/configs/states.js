(function () {
    'use strict';

    angular
        .module('app')
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state('login', {
                    url: "/login",
                    templateUrl: "components/login/login.html",
                    controller: "LoginController as loginCtrl"
                })
                .state('registration', {
                    url: "/registration",
                    templateUrl: "components/registration/registration.html",
                    controller: "RegistrationController as registrationCtrl"
                })
                .state('profile', {
                    url: "/profile",
                    templateUrl: "components/profile/profile.html",
                    controller: "ProfileController as profileCtrl",
                    resolve: {
                        //if loggen in then go to profile
                        logincheck: function checkLoggedIn($q, $timeout, $http, $state, $rootScope) {
                            var deferred = $q.defer();

                            $http.get('/loggedin').success(function (user) {
                                $rootScope.errorMessage = null;
                                //User is Authenticated
                                if (user !== '0') {
                                    $rootScope.currentUser = user;
                                    deferred.resolve();
                                }
                                //User in NOT Authenticated
                                else {
                                    $rootScope.errorMessage = 'You need to log in';
                                    deferred.reject();
                                    $state.go('login');

                                }

                            });
                            // return deferred.promise;
                        }
                    }
                })
                .state('flats', {
                    url: "/",
                    templateUrl: "components/flats/flats.html",
                    controller: 'FlatsController as flats',
                    resolve: {
                        flats: function ($http) {
                            return $http.get('/api/flats')
                                .then(function success(response) {
                                    return response.data
                                })
                        }
                    }
                })
                .state('add', {
                    url: "/add-flat",
                    templateUrl: "components/add-flat/add-flat.html",
                    controller: 'AddFlatController as add'
                })
                .state('flat', {
                    url: '/flat/:id',
                    templateUrl: 'components/flat/flat.html',
                    controller: 'FlatController as flatCtrl',
                    resolve: {
                        flat: function ($http, $stateParams) {
                            var id = $stateParams.id
                            return $http.get('/api/flat/' + id)
                                .then(function (response) {
                                    return response.data
                                })
                        }
                    }
                })
        });

})();