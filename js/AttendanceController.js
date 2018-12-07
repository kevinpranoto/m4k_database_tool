var eventAttendance = angular.module('eventAttendance', ['ui.select', 'ngSanitize']);
eventAttendance.controller('EventAttendanceForm', function($scope, $location, $window, $http) {
/*
    $scope.itemArray = [
        {id: 1, name: 'first'},
        {id: 2, name: 'second'},
        {id: 3, name: 'third'},
        {id: 4, name: 'fourth'},
        {id: 5, name: 'fifth'},
    ];
    $scope.selected = { value: $scope.itemArray[0] };
    */

    $scope.allDonors = [];
    $http.get('http://127.0.0.1:8081/donors').then((res)=>
    {
        console.log(res.data);
        for (var i in res.data)
        {
            var obj = res.data[i];
            var donor = { id: obj.supporter_id, name: obj.first_name + ' ' + obj.last_name};
            if (obj.company_name != null) {
                donor.name += " from " + obj.company_name;
            }
            $scope.allDonors.push(donor);
        }
    });

    $scope.donorSelected = [
        {value: null}
    ];

    $scope.addAttendanceDonor = function() {
        $scope.donorSelected.push({value: null});
        console.log($scope.donorSelected);
    };

    $scope.allStaff = [];
    $http.get('http://127.0.0.1:8081/staff').then((res)=>
    {
        console.log(res.data);
        for (var i in res.data)
        {
            var obj = res.data[i];
            var staff = { id: obj.supporter_id, name: obj.first_name + ' ' + obj.last_name + ' - ' + obj.staff_type};
            $scope.allStaff.push(staff);
        }
    });

    $scope.staffSelected = [
        {value: null}
    ];

    $scope.addAttendanceStaff = function() {
        $scope.staffSelected.push({value: null});
        console.log($scope.staffSelected);
    };

    // Populate donorSelected and staffSelected with the donor and staff array from campaign

    $scope.submitAttendance = function() {
        var donorIDList = [];
        var staffIDList = [];

        $scope.donorSelected.forEach(donor => {
            donorIDList.push(donor.value.id);
        });

        $scope.staffSelected.forEach(staff => {
            staffIDList.push(staff.value.id);
        });

        console.log("donors: ");
        console.log(donorIDList.toString());
        console.log("\nstaff: ");
        console.log(staffIDList.toString());
    };

});