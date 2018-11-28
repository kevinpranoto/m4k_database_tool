var allPatients = angular.module('allPatients', []);
var entitySpecific = angular.module('entitySpecific', []);

allPatients.controller('PatientController', function($scope, $location, $window) {

    $scope.patient_members = [
        {id : '1', needs : 'Car', notes : 'For work'},
        {id : '2', needs : 'Food', notes : 'To eat'}
	];

    let patientID = {};

    function set(data) {
        patientID = data;
    }

    function get() {
        console.log("called");
        return patientID;
    }

    /* Function for providing the ability to highlight any given entry in a data table. */
    $scope.selectedRow = null;                          // Initialize selectedRow to null
    $scope.setClickedRow = function (index) {           // Set the value of the row to current index
        $scope.selectedRow = index;
        $scope.isDisabled = true;
    };

    /*  the "Add Entry" button. */
    $scope.redirectToPatientForm = function(){
        $window.location.href = '../pages/patient_form.html';
    };

    $scope.removeRow = function(index){
        // Prompt user to confirm deletion; clicking OK returns true, Cancel returns false.
        let deleteRow = $window.confirm("Are you sure you want to delete this entry?");

        // If user clicked OK, handle the deletion.
        if (deleteRow) {
            patient_members.splice(index, 1);     // Just a placeholder, but will need code to update DB via Node.js?
        }
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