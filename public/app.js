/* global angular */
(function () {
    angular.module('app', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider) {
            //
            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/");
            //
            // Now set up the states
            $stateProvider
                .state('flats', {
                    url: "/",
                    templateUrl: "/flats.html",
                    controller: function (flats, $http) {
                        var vm = this
                        angular.extend(vm, {
                            flats: flats,
                            deleteFlat: deleteFlat
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
                    },
                    controllerAs: 'flats',
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
                    templateUrl: "/add-flat.html",
                    controller: 'AddFlatController as add'
                })
                .state('flat', {
                    url: '/flat/:id',
                    templateUrl: '/flat.html',
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
        })
        .controller('AddFlatController', function ($http, $state) {
            var vm = this

            angular.extend(vm, {
                input: {
                    title: '',
                    description: ''
                },
                submit: submit
            })

            function submit($event) {
                $http.post('/api/flats', vm.input)
                    .then(function success(response) {
                        $state.go('flats')
                    })
            }
        })
        .controller('AddCommentController', function ($http, $state, $stateParams) {
            var vm = this

            angular.extend(vm, {
                input: {
                    comment: ''
                   
                },
                submit: submit
                
            })

            function submit($event) {
                $http.post('/api/flat/', vm.input)
                    .then(function success(response) {
                        $state.go('flats')
                    })
            }
        })
        .controller('FlatController', function ($http, flat) {
            var vm = this

            angular.extend(vm, {
                flat: flat,
                input: {
                    comment: 'wopfjqpfq',
                },
                submit: submit
            });
            
            function submit($event) {
                $event.preventDefault();
                var id = flat._id;
                $http.post('/api/flat/' + id + '/comment', vm.input)
                .then(function (response) {
                    vm.flat = response.data;
                })
                .catch(function (reason) {
                    alert('errorrrr')
                })
            }
        });

    angular.bootstrap(document.getElementById('app'), ['app'])
})()


