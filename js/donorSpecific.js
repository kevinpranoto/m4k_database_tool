var donorSpecific = angular.module('donorSpecific', []);

donorSpecific.controller('donorData', function($scope, $location, $window, $http) {
    var id = sessionStorage.getItem('entityID');
    var name = sessionStorage.getItem('entityName');
    $scope.entityID = id;
    $scope.entityName = name;
    console.log(id);
    var basic_info_arr = [];
    var phones = [];
    var emails = [];
    var addresses = [];
    var getString = 'http://127.0.0.1:8081/donors/' + id;
    $http.get(getString).then((res)=>
    {
        var obj = res.data;
        basic_info_arr.push(res.data.basic[0]);
        console.log(basic_info_arr);
        var basic_info = basic_info_arr[0];
        console.log(basic_info);
        $scope.fullName = basic_info.salutation + ' ' +
                           basic_info.first_name + ' ' +
                           basic_info.last_name;
        $scope.alias = basic_info.alias;
        $scope.status = basic_info.donor_status;
    });
});