(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', function ($http, $rootScope, $state) {
            var vm = this;

            angular.extend(vm, {
                user: {
                    username: '',
                    password: ''
                },
                login: login,
                errorMessage: false
            });

            function login(user) {

                // $rootScope.loginerror = false;
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
                        // $rootScope.loginerror = true;
                        vm.errorMessage = true;
                        //form reset after submit
                        vm.user = { username: '', password: '' }



                    });
            }

        });
})();