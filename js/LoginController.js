var LoginController = angular.module('LoginController', []);
LoginController.controller('loginForm', function($scope, $location, $window, $http) {
    console.log("test");
    var login = {
        username: '',
        password: '',
    }
    
    $scope.loginClick = function(keypress) {
        if (keypress.which == 13 || keypress == '') {
            login.username = $scope.user_name;
            login.password = $scope.password;
            $http.post('http://127.0.0.1:8081/login', login).then((res) => {
                sessionStorage.setItem('username', login.username);
                sessionStorage.setItem('password', login.password);
                $scope.status = ""
                window.location.href = "../pages/all_donors.html";
            }, (err) => {
                $scope.user_name = "";
                $scope.password = "";
                $scope.status = "Login credentials not recognized";
            });
            console.log(login);
        }
    }
});