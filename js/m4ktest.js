var allDonors = angular.module('allDonors', []);
var entitySpecific = angular.module('entitySpecific', []);

allDonors.controller('donorsTable', function($scope, $location, $window) {
    
    $scope.donors = [
        {id : '1', name : 'Brian Gomez', company : '' , last_contribution_date : 'Nov 6 2017', phone : '(449) 443 2334', email : 'brian@bb.com'},
        {id : '2', name : 'Lu Zhao', company : 'MediaTek' , last_contribution_date : 'Nov 13 2018', phone : '(422) 643 2314', email : 'lu@tek.com'},
        {id : '3', name : 'Gina Weasley', company : 'Hogwarts' , last_contribution_date : 'Jan 8 2018', phone : '(221) 443 8897', email : 'ginaw@hogwarts.com'},
        {id : '4', name : 'Winston Beard', company : '' , last_contribution_date : 'Jul 4 2018', phone : '(889) 111 1111', email : 'winstonb@ab.com'},
        {id : '5', name : 'Mikel Zed', company : 'BBC' , last_contribution_date : 'Aug 3 2017', phone : '(221) 990 3322', email : 'mzed@ab.com'} 
    ];
    
    var donorID = {};


    function set(data) {
        donorID = data;
    };

    function get() {
        console.log("called");
        return donorID;
    };
    
    $scope.goToDonor = function(donor) {
        window.location.href = '../pages/donor_basic_info.html';
        sessionStorage.setItem('entityID', donor.id);
        sessionStorage.setItem('entityName', donor.name)
        console.log("click " + sessionStorage.getItem('entityID'));
    };

    return {
        set: set,
        get: get
    };
});

entitySpecific.controller('entityData', function($scope) {
    var id = sessionStorage.getItem('entityID');
    var name = sessionStorage.getItem('entityName');
    $scope.entityID = id;
    $scope.entityName = name;
    console.log(id);
});