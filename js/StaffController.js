var allStaff = angular.module('allStaff', []);
var entitySpecific = angular.module('entitySpecific', []);

allStaff.controller('StaffController', function($scope, $location, $window) {

    $scope.staff_members = [
        {id : '1', first_name : 'Bon', middle_name : '' , last_name: 'Davis' , phone : '(449) 443 2334', email : 'brian@bb.com', type: 'Staff', status: 'Active'},
        {id : '2', first_name : 'Poop', middle_name : 'Lol' , last_name: 'McScoop' , phone : '(422) 643 2314', email : 'lu@tek.com', type: 'Staff/Donor', status: 'Lax'},
        {id : '3', first_name : 'Gina', middle_name : 'Bob' , last_name: 'Wong', phone : '(221) 443 8897', email : 'ginaw@hogwarts.com', type: 'Staff', status: 'Active'},
        {id : '4', first_name : 'Def', middle_name : '' , last_name: 'Leppard', phone : '(889) 111 1111', email : 'winstonb@ab.com', type: 'Staff/Donor', status: 'Lost'},
        {id : '5', first_name : 'Led', middle_name : 'Hi' , last_name: 'Zeppelin', phone : '(221) 990 3322', email : 'mzed@ab.com', type: 'Donor', status: 'Active'}
    ];

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