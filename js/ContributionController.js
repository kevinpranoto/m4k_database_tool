(function(){
    let allContributions = angular.module("allContributions", []);

    allContributions.controller("ContributionController", function($scope, $location, $window) {

        $scope.contributions = [
            {id : '1', donor_name : 'Jack Stefanski', cont_name : 'Donation from Jack', cont_type : 'Cash', appeal: 'Radio', notes: 'Paid in Prussian Francs'},
            {id : '2', donor_name : 'Jock Lupinski', cont_name : 'Tomatoes', cont_type : 'Goods', appeal: 'Direct Mail', notes: 'Thought that it was a good idea to use Kraft Singles for mac n cheez'},
            {id : '3', donor_name : 'Honk Duckerson', cont_name : 'Backrubs', cont_type : 'Services', appeal: 'Sponsorship', notes: ';)'},
            {id : '4', donor_name : 'Puck Cluck', cont_name : 'Donation from Puck', cont_type : 'Cash', appeal: 'Radio', notes: 'Paid in Indian Rupees'}
        ];

        /* Function for providing the ability to highlight any given entry in a data table. */
        $scope.selectedRow = null;                          // Initialize selectedRow to null
        $scope.setClickedRow = function (index) {           // Set the value of the row to current index
            $scope.selectedRow = index;
            $scope.isDisabled = true;
        };

        $scope.ContributionTypeChanged = function() {
            $scope.typeStatus = $scope.TypeValue;
        };

        $scope.redirectToContributionForm = function() {
            $window.location.href = "../pages/contribution_form.html";
        };

        $scope.reloadPage = function() {
            $window.location.href = "../pages/contribution_form.html";
        };

        $scope.removeRow = function(index){

            // Prompt user to confirm deletion; clicking OK returns true, Cancel returns false.
            let deleteRow = $window.confirm("Are you sure you want to delete this entry?");

            // If user clicked OK, handle the deletion.
            if (deleteRow) {
                staff_members.splice(index, 1);     // Just a placeholder, but will need code to update DB via Node.js?
            }
        };

        $scope.goToContribution = function(contribution) {
            window.location.href = '../pages/contribution_basic_info.html';
            sessionStorage.setItem('entityID', contribution.id);
            let cont_name = contribution.cont_name;
            sessionStorage.setItem('entityName', cont_name)
            console.log("click " + sessionStorage.getItem('entityID'));
        };
    });
}());

