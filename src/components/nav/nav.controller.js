(function () {
    'use strict';

    angular
        .module('app')
        .controller("NavController", function ($rootScope, $http, $state) {
            var vm = this;
            this.logout = function () {
                $http.post('/logout')
                    .success(function () {
                        $rootScope.currentUser = null;
                        $state.go('flats');
                    })
            }

        });
})();
