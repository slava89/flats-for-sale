(function () {
    'use strict';

    angular
        .module('app')
        .run(function ($rootScope, $http, $state) {
            $rootScope.loggedIn = function () {
                $http.post('/isloggedIn').success(function (data) {
                    if (data.state == 'success') {
                        $rootScope.authenticated = true;
                        $rootScope.currentUser = data.user;
                        // $state.go('flats');
                    } else {
                        $rootScope.authenticated = false;
                        $rootScope.currentUser = '';
                        $state.go('flats');
                    }
                });
            }

            $rootScope.loggedIn();
        });
})();