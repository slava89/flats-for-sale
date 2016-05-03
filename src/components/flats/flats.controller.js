(function () {
    'use strict';

    angular
        .module('app')
        .controller('FlatsController', function (flats, $http, $rootScope) {
            var vm = this
            angular.extend(vm, {
                flats: flats,
                deleteFlat: deleteFlat,
                addFlatLike: addFlatLike
                , isAdmin: isAdmin
            })

            function deleteFlat(_id) {
                $http.delete('/api/flat/' + _id)
                    .then(function (response) {
                        return $http.get('/api/flats')
                    })
                    .then(function (response) {
                        return response.data
                    })
                    .then(function (data) {
                        vm.flats = data
                    })
            }

            function addFlatLike(_id) {

                $http.post('/api/flat/' + _id + '/flatLikes')
                    .then(function (response) {
                        return $http.get('/api/flats')
                    })
                    .then(function (response) {
                        vm.flats = response.data
                    })


                // .then(function (response) {
                //     return response.data
                // })
                // .then(function (data) {
                //     vm.flats = data
                // })

            }

            function isAdmin() {
                if ($rootScope.currentUser) {
                    if ($rootScope.currentUser.roles[0] == 'admin') {
                        return true;
                    } else {
                        return false;
                    }

                } else {
                    return false;
                }
            }
        });
})();