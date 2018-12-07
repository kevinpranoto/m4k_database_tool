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
    // var eventID = sessionStorage.getItem('entityID');
    function search(idKey, myArray){
        console.log('searching for ' + idKey + ' in ');
        console.log(myArray);
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].id == idKey) {
                return myArray[i];
            }
        }
        console.log('found nothing');
    }

    var eventID = sessionStorage.getItem('entityID');
    $scope.eventObj = {};
    var eventBasicInfo = {};
    var existingDonors = [];
    var existingStaff = [];

    $scope.donorSelected = [
    ];
    $scope.staffSelected = [
    ];
    $scope.campaignName = eventBasicInfo.campaign_name;
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

    console.log($scope.eventObj.donors);

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

    $scope.addAttendanceStaff = function() {
        $scope.staffSelected.push({value: null});
        console.log($scope.staffSelected);
    };
    console.log('donorSelected');
    console.log($scope.donorSelected);
    console.log('staffSelected');
    console.log($scope.staffSelected);
    // Populate donorSelected and staffSelected with the donor and staff array from campaign

    $http.get('http://127.0.0.1:8081/events/' + eventID).then((res) => {
        $scope.eventObj = res.data;
        eventBasicInfo = res.data.basic[0];
        existingDonors = res.data.donors;
        existingStaff = res.data.staff;
        
        console.log($scope.eventObj);
        console.log(existingDonors);
        console.log(existingStaff);
        existingDonors.forEach(donorID => {
            console.log(donorID.supporter_id);
            var tempDonor = search(donorID.supporter_id, $scope.allDonors);
            console.log('found yeet');
            console.log(tempDonor);
            $scope.donorSelected.push({value: tempDonor});
        });
        existingStaff.forEach(staffID => {
            console.log(staffID.supporter_id);
            var tempStaff = search(staffID.supporter_id, $scope.allStaff);
            console.log('found');
            console.log(tempStaff);
            $scope.staffSelected.push({value: tempStaff});
        });
    });

    $scope.submitAttendance = function() {
        var donorIDList = [];
        var staffIDList = [];

        $scope.donorSelected.forEach(donor => {
            donorIDList.push(donor.value.id);
        });

        $scope.staffSelected.forEach(staff => {
            staffIDList.push(staff.value.id);
        });

        var objToSubmit = {
            campaign_name: $scope.eventObj.basic[0].campaign_name,
            campaign_type_id: $scope.eventObj.basic[0].campaign_type_id,
            is_event: 1,
            campaign_date: $scope.eventObj.basic[0].campaign_date,
            theme: $scope.eventObj.basic[0].theme,
            donors: [],
            staff: [],
            contributions: $scope.eventObj.contributions
        };

        objToSubmit.donors = donorIDList;
        objToSubmit.staff = staffIDList;
        console.log("donors: ");
        console.log(donorIDList.toString());
        console.log("\nstaff: ");
        console.log(staffIDList.toString());
        console.log($scope.eventObj); 

        console.log(objToSubmit);
        $http.put('http://127.0.0.1:8081/campaigns/' + $scope.eventObj.basic[0].campaign_id, objToSubmit).then((res) => {
            console.log(res);
        });
    };

});