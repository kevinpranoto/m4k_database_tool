var allDonors = angular.module('allDonors', []);
var entitySpecific = angular.module('entitySpecific', []);

allDonors.controller('donorsTable', function($scope, $location, $window, $http) {
    
    $scope.donors = [];
    
    var donorID = {};

    console.log('test');
    $http.get('http://127.0.0.1:8081/donors').then((res)=>
    {
        console.log(res.data);
        for (var i in res.data)
        {
            var obj = res.data[i];
            var donor = { id: obj.supporter_id, name: obj.first_name + ' ' + obj.last_name, company: obj.company_name, last_contribution_date: 'N/A', phone: obj.phone_number, email: obj.email_address };
            $scope.donors.push(donor);
        }
    });

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

        $http.get('http://127.0.0.1:8081/donors/' + sessionStorage.getItem('entityID')).then((res) =>
        {
            console.log(res.data);
        });
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

var donorEntry = angular.module('donorEntry', []);

donorEntry.controller('donorForm', function($scope) {
    $scope.salutations = [
        'Mr.', 'Ms.', 'Mrs.', 'Dr.', 
        'Prof.', 'Rev.', 'Lady', 'Sir'
    ];

    $scope.phoneTypes = [
        'Home', 'Work', 'Mobile'
    ];

    $scope.statuses = [
        'Active', 'Lax', 'Lost'
    ];

    $scope.addressTypes = [
        'Residential', 'Business'
    ];

    $scope.submitDonor = function() {
        var name = $scope.salutation + " " + $scope.firstName + 
            " " + $scope.lastName + "\nAlso known as " + $scope.alias;
        console.log(name);
    };
});

var eventEntry = angular.module('eventEntry', []);
eventEntry.controller('eventForm', function($scope) {
    $scope.submitEvent = function() {
        console.log($scope.date);
        console.log("tada");
    };
});
