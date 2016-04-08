/* global angular */
(function () {
    var app = angular.module('app', ['ui.router'])

    


        app.config(function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state('login', {
                    url: "/login",
                    templateUrl: "/login.html",
                    controller: "LoginController as loginCtrl"
                })

                .state('registration', {
                    url: "/registration",
                    templateUrl: "/registration.html",
                    controller: "RegistrationController as registrationCtrl"
                })

                .state('profile', {
                    url: "/profile",
                    templateUrl: "/profile.html",
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
                    templateUrl: "/flats.html",
                    controller: function (flats, $http, $rootScope) {
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
                                    return response.data
                                })
                                .then(function (data) {
                                    vm.flats = data
                                })

                        }

                        function isAdmin() {
                            if ($rootScope.currentUser) {
                                if ($rootScope.currentUser.roles[0] == 'admin') {
                                    return true;
                                }
                                else {
                                    return false;
                                }

                            }
                            else {
                                return false;
                            }
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
        
        

        app.controller('LoginController', function ($http, $rootScope, $state) {
            var vm = this;

            angular.extend(vm, {
                user: {
                    username: '',
                    password: ''
                },
                login: login
            })



            function login(user) {

                $rootScope.loginerror = false;
                // console.log(vm.user)
                $http.post('/login', vm.user)
                    .success(function (response) {
                        console.log(response);
                        $rootScope.currentUser = user;
                        // errormessage = false;
                        $state.go('profile');//res.redirect('/users/' + req.user.username); ADD later!!!!!
                        
                    })
                    .error(function () {

                //     //    document.getElementById('errormessage').innerHTML = "Bad name or password";
                // //    errormessage = true;
                $rootScope.loginerror = true;
                

                    });
            }

        })

        app.controller('RegistrationController', function ($http, $rootScope, $state) {
            var vm = this;

            angular.extend(vm, {
                user: {
                    username: '',
                    password: '',
                    password2: ''
                },
                register: register
            })

            function register(user) {
                console.log(vm.user);
                $rootScope.errorregister = false;
                //todo verify passwors are the same and notify user
                if (vm.user.password == vm.user.password2) {
                    $http.post('/registration', vm.user)
                        .success(function (user) {
                            $rootScope.currentUser = user;
                            console.log(user);
                            $state.go('profile');

                        });
                }
                else{
                    $rootScope.errorregister = true;
                }

            };

        })

        app.controller('ProfileController', function ($http) {
            var vm = this;
            $http.get('/rest/user')
                .success(function (users) {
                    vm.users = users;
                })
        })



        app.controller('AddFlatController', function ($http, $state) {
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

        app.controller('FlatController', function ($http, flat) {
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
                    .catch(function (reason) {
                        alert('errorrrr')
                    })
            }

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

        app.controller("NavController", function ($rootScope, $http, $state) {
            var vm = this;
            this.logout = function () {
                $http.post('/logout')
                    .success(function () {
                        $rootScope.currentUser = null;
                        $state.go('flats');
                    })
            }

        }) 
        
        angular.module('app').run(function ($rootScope, $http, $state) {
            $rootScope.loggedIn = function () {
                $http.post('/isloggedIn').success(function (data) {
                    if (data.state == 'success') {
                        $rootScope.authenticated = true;
                        $rootScope.currentUser = data.user;
                        // $state.go('flats');
                    }
                    else {
                        $rootScope.authenticated = false;
                        $rootScope.currentUser = '';
                        $state.go('flats');
                    }
                });
             }
                
                $rootScope.loggedIn();
            })
        
        angular.bootstrap(document.getElementById('app'), ['app'])


    })()



