var LoginController = angular.module('LoginController', []);
LoginController.controller('loginForm', function($scope, $location, $window, $http) {
    console.log("test");
    var login = {
        user_name: '',
        password: '',
    }
    
    $scope.loginClick = function() {
        login.user_name = $scope.user_name;
        login.password = $scope.password;
        console.log(login);
    }
});