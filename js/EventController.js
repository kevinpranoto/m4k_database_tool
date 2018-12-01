var allStaff = angular.module('allEvents', []);
var entitySpecific = angular.module('entitySpecific', []);

allStaff.controller('EventController', function($scope, $location, $window, $http) {

    $scope.events = [];

    $http.get('http://127.0.0.1:8081/events').then((res) =>
    {
        console.log(res.data);
        for (var i in res.data)
        {
            var obj = res.data[i];
            var event = { id: obj.event_id, name: obj.campaign_name, date: obj.campaign_date, theme: obj.theme}
            $scope.events.push(event);
        }
    });

    let staffID = {};

    function set(data) {
        staffID = data;
    }

    function get() {
        console.log("called");
        return staffID;
    }

    /* Function for providing the ability to highlight any given entry in a data table. */
    $scope.selectedRow = null;                          // Initialize selectedRow to null
    $scope.setClickedRow = function (index) {           // Set the value of the row to current index
        $scope.selectedRow = index;
        $scope.isDisabled = true;
    };

    /* Function to redirect the user from Staff View to data entry form for a new Staff object upon clicking
    *  the "Add Entry" button. */
    $scope.redirectToStaffForm = function(){
        $window.location.href = '../pages/staff_form.html';
    };

    $scope.removeRow = function(index){

        // Prompt user to confirm deletion; clicking OK returns true, Cancel returns false.
        let deleteRow = $window.confirm("Are you sure you want to delete this entry?");

        // If user clicked OK, handle the deletion.
        if (deleteRow) {
            staff_members.splice(index, 1);     // Just a placeholder, but will need code to update DB via Node.js?
        }
    };

    $scope.goToStaff = function(staff) {
        window.location.href = '../pages/staff_basic_info.html';
        sessionStorage.setItem('entityID', staff.id);
        let staff_name = staff.first_name + " " + staff.last_name;
        sessionStorage.setItem('entityName', staff_name)
        console.log("click " + sessionStorage.getItem('entityID'));
    };

    return {
        set: set,
        get: get
    };
});

entitySpecific.controller('entityData', function($scope) {
    let id = sessionStorage.getItem('entityID');
    let name = sessionStorage.getItem('entityName');
    $scope.entityID = id;
    $scope.entityName = name;
    console.log(id);
});

/* Graveyard of possibly usable codes:

// Separate controller for deleting an entity from a given data table
removeEntity.controller('removeEntityController', function($scope, $location, $window) {
    $scope.removeEntity = function(index){
        // Prompt user to confirm deletion; clicking OK returns true, Cancel returns false.
        let deleteEntity = $window.confirm("Are you sure you want to delete this entry?");

        // If user clicked OK, handle the deletion.
        if (deleteEntity){
            $scope.staff_members.splice(idx, 1);
        }
    };
});

*/