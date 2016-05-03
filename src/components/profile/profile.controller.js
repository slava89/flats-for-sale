(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', function ($http) {
            var vm = this;
            $http.get('/rest/user')
                .success(function (users) {
                    vm.users = users;
                })
        });
})();