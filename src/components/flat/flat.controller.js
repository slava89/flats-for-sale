(function () {
    'use strict';

    angular
        .module('app')
        .controller('FlatController', function ($http, flat) {
            var vm = this

            angular.extend(vm, {
                flat: flat,
                input: {
                    comment: 'wopfjqpfq',
                },
                submit: submit,
                deleteComment: deleteComment
            });

            function submit($event) {
                $event.preventDefault();
                var id = flat._id;
                $http.post('/api/flat/' + id + '/comment', vm.input)
                    .then(function (response) {
                        vm.flat = response.data;
                    })
                // .then(function (response) {
                //     vm.flat = response.data;
                // })
                // .catch(function (reason) {
                //     alert('errorrrr')
                // })
            }

            // function addComment() {

            //     var id = flat._id;
            //     $http.post('/api/flat/' + id + '/comment', vm.input)
            //         .then(function (response) {
            //             vm.flat = response.data;
            //         })
            //         // .then(function (response) {
            //         //     vm.flat = response.data;
            //         // })
            //         // .catch(function (reason) {
            //         //     alert('errorrrr')
            //         // })
            // }

            function deleteComment($index) {
                var id = flat._id;
                var index = $index;


                $http.delete('/api/flat/' + id + '/comment/' + index)
                    .then(function (response) {
                        return $http.get('/api/flat/' + id)
                    })
                    .then(function (response) {
                        return response.data
                    })
                    .then(function (data) {
                        vm.flat = data
                    })
            }
        });
})();
