(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddFlatController', function ($http, $state) {
            var vm = this

            angular.extend(vm, {
                input: {
                    title: '',
                    description: ''
                },
                submit: submit
            });

            function submit($event) {
                $http.post('/api/flats', vm.input)
                    .then(function success(response) {
                        $state.go('flats');
                    });
            }
        });
})();