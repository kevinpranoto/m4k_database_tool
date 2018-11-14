var allDonors = angular.module('allDonors', []);

allDonors.controller('donorsTable', function($scope, $location, $window) {
    $scope.goToDonor = function() {
        window.location.href = '../pages/donor_basic_info.html';
        console.log("click");
    };
});
