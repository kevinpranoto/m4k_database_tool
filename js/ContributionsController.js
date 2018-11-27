var allContributions = angular.module('allContributions', []);
var entitySpecific = angular.module('entitySpecific', []);

allContributions.controller('ContributionsController', function($scope, $location, $window) {

    $scope.contributions = [
        {id : '1', contributon_name : 'Chips', type : 'Goods' , money_amount: '' , pay_method : '', appeal : 'Direct Mail', type: 'Staff', status: 'Active'},
        {id : '2', contributon_name : 'Cookies', type : 'Goods' , money_amount: '' , pay_method : '(', appeal : 'Sponsorship', type: 'Staff/Donor', status: 'Lax'},
        {id : '3', contributon_name : 'Donation', type : 'Money' , money_amount: '40.00', pay_method : 'Check', appeal : '', type: 'Staff', status: 'Active'},
    ];

    let contributionID = {};

    function set(data) {
        contributionID = data;
    }

    function get() {
        console.log("called");
        return contributionID;
    }

    /* Function for providing the ability to highlight any given entry in a data table. */
    $scope.selectedRow = null;                          // Initialize selectedRow to null
    $scope.setClickedRow = function (index) {           // Set the value of the row to current index
        $scope.selectedRow = index;
        $scope.isDisabled = true;
    };

    /* Function to redirect the user from Staff View to data entry form for a new Staff object upon clicking
    *  the "Add Entry" button. */
    $scope.redirectToContributionForm = function(){
        $window.location.href = '../pages/contribution_form.html';
    };

    $scope.removeRow = function(index){

        // Prompt user to confirm deletion; clicking OK returns true, Cancel returns false.
        let deleteRow = $window.confirm("Are you sure you want to delete this entry?");

        // If user clicked OK, handle the deletion.
        if (deleteRow) {
            contributions.splice(index, 1);     // Just a placeholder, but will need code to update DB via Node.js?
        }
    };

    $scope.goToContribution = function(contribution) {
        window.location.href = '../pages/contribution_basic_info.html';
        sessionStorage.setItem('entityID', contribution.id);
        let contribution_name = contribution.name;
        sessionStorage.setItem('entityName', contribution.name)
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