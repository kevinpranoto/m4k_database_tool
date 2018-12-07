var LoginController = angular.module('LoginController', []);
LoginController.controller('loginForm', function($scope, $location, $window, $http) {
    console.log("test");
    var login = {
        username: '',
        password: '',
    }
    
    $scope.loginClick = function() {
        login.username = $scope.user_name;
        login.password = $scope.password;

        $http.post('http://127.0.0.1:8081/login', login).then((res) => {
            sessionStorage.setItem('username', login.username);
            sessionStorage.setItem('password', login.password);

            window.location.href = "../pages/all_donors.html";
        });
        console.log(login);
    }
});