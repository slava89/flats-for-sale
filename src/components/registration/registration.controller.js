(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegistrationController', function ($http, $rootScope, $state) {
            var vm = this;

            angular.extend(vm, {
                user: {
                    username: '',
                    password: '',
                    password2: ''
                },
                register: register,
                errorMessage: false
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
                else {
                    vm.errorMessage = true;
                    vm.user = { username: '', password: '', password2: '' }
                }

            };
        });
})();
