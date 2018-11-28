var patientEntry = angular.module('patientEntry', []);
patientEntry.controller('patientForm', function($scope) {
    $scope.submitPatient = function() {
        var patient = {
            needs: $scope.needs,
            notes: $scope.notes
        }
        
        console.log(JSON.stringify(patient));
    };	
});