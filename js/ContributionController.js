(function(){
    let allContributions = angular.module("contributionEntry", []);

    allContributions.controller("ContributionController", function($scope, $location, $window, $filter) {

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
            $scope.typeStatus = $scope.contribType;
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
            sessionStorage.setItem('entityName', cont_name);
            console.log("click " + sessionStorage.getItem('entityID'));
        };

        /**
         * Fields and function specific to retrieving data from the input form fields to be packaged into JSON format
         */
        $scope.contribTypes = [
            'Goods', 'Services', 'Money'
        ];

        // Field is optional, but only needed if the contribution type is "Money"
        $scope.contribPaymentMethods = [
            'Cash', 'Credit Card', 'Check', 'Stock'
        ];

        $scope.contribAppeals = [
            'Direct Mail', 'Email Campaign', 'Radio Advertisement', 'Sponsorship',
            'Fund-a-Need', 'Opportunity Ticket', 'Silent Auction', 'Live Auction'
        ];

        $scope.contribDestinations = [
            'General', 'Miracle Manor', 'Basket of Miracles', 'Grant Program', 'Health & Wellness'
        ];

        $scope.contribIsEventChoices = [
            'Yes', 'No'
        ];

        /**
         * Function to submit the data from a form page to be packaged into JSON format for back-end to store the data.
         * Initializes all the fields with the fields that a new pledge should have when entering the data into the database.
         */
        $scope.submitContribution = function() {
            let newContribution = {
                itemName: $scope.contribName,
                type: $scope.contribType,
                amount: $filter('number')($scope.contribAmount, 2),         // Auto-filters amount to two decimal places
                paymentMethod: $scope.contribPaymentMethod,
                appeal: $scope.contribAppeal,
                destination: $scope.contribDestination,
                isEvent: $scope.isEvent.Choice,
                notes: $scope.contribNotes
            };

            // Send the JSON data to back-end server, and confirms the data output in console
            console.log(JSON.stringify(newContribution));
        };
    });
}());

