var allPatients = angular.module('allPatients', []);
var patientSpecific = angular.module('patientSpecific', []);
var patientEntry = angular.module('patientEntry', []);

allPatients.controller('PatientController', function($scope, $location, $window, $http) {

    $scope.patients = [];

    $http.get('http://127.0.0.1:8081/patients').then((res) =>
    {
        for (var i in res.data)
        { 
            var obj = res.data[i];
            var patient = { id: obj.patient_id, needs: obj.item };
            $scope.patients.push(patient);
        }
    });

    let patientID = {};

    function set(data) {
        patientID = data;
    }

    function get() {
        console.log("called");
        return patientID;
    }

    $scope.goToPatient = function(patient) {
        sessionStorage.setItem('patientID', patient.id);
        window.location.href = '../pages/patient_basic_info.html';
    };

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

    $scope.removeEntries = function() {
        var something_deleted = false;
        $scope.patients.forEach(pat => {
            if (pat.to_remove == true) {
                var deletePrompt = $window.confirm("Delete " + pat.name + "? (Deletion cannot be reverted)");
                if (deletePrompt) {
                    something_deleted = true;
                    $http.delete('http://127.0.0.1:8081/patients/' + pat.id);
                };
            };
        });
        if (something_deleted) {
            window.location.href = '../pages/all_patients.html';
        };
    };

    return {
        set: set,
        get: get
    };
});

patientSpecific.controller('patientBasicInfo', ($scope, $location, $window, $http) => {
    $scope.id = sessionStorage.getItem('patientID');
    var req = 'http://127.0.0.1:8081/patients/' + sessionStorage.getItem('patientID');

    $http.get(req).then((res) => {
        var obj = res.data;
        $scope.needs = [];
        console.log(obj);

        obj.needs.forEach(need => {
            $scope.needs.push(need.item);
        });

        sessionStorage.setItem('patientItem', JSON.stringify(obj));
    });
});

patientSpecific.controller('patientPledges', ($scope, $location, $window, $http) => {
    $scope.id = sessionStorage.getItem('patientID');
    $scope.pledges = [];
    var obj = JSON.parse(sessionStorage.getItem('patientItem'));
    
    obj.pledges.forEach(p => {
        var date = new Date(p.pledge_date);
        var pledge = { patron: p.first_name + ' ' + p.last_name, target_amount: '$' + p.target_amount, date: date.toDateString()};
        $scope.pledges.push(pledge);
    });
});

patientEntry.controller('patientForm', function($scope) {
    $scope.needs = [
        {item: ''}
    ];

    $scope.addNeed = function() {
        $scope.needs.push({item: ''});
	};

    $scope.submitPatient = function() {
        var patient = {
            needs: []
        };

        $scope.needs.forEach(n => {
            patient.needs.push(n);
        });

        JSON.stringify(patient)
    };	
});