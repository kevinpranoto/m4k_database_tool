(function(){
    let allContributions = angular.module("contributionEntry", []);

    allContributions.controller("ContributionController", function($scope, $location, $window, $filter) {

        //////////////////////////////////// DUMMY DATA: TO BE DELETED ///////////////////////////////////////
        $scope.contributions = [
            {id : '1', donor_name : 'Jack Stefanski', cont_name : 'Donation from Jack', cont_type : 'Cash', appeal: 'Radio', notes: 'Paid in Prussian Francs'},
            {id : '2', donor_name : 'Jock Lupinski', cont_name : 'Tomatoes', cont_type : 'Goods', appeal: 'Direct Mail', notes: 'Thought that it was a good idea to use Kraft Singles for mac n cheez'},
            {id : '3', donor_name : 'Honk Duckerson', cont_name : 'Backrubs', cont_type : 'Services', appeal: 'Sponsorship', notes: ';)'},
            {id : '4', donor_name : 'Puck Cluck', cont_name : 'Donation from Puck', cont_type : 'Cash', appeal: 'Radio', notes: 'Paid in Indian Rupees'}
        ];

        ///////////////////////// GENERAL FUNCTIONS FOR CONTRIBUTION-RELATED ITEMS ///////////////////////////

        /* Function for providing the ability to highlight any given entry in a data table. */
        /**
         * setClickedRow($index)
         * Function for retrieving the index of the item clicked on in a given data table.
         * Supports the highlighting functionality.
         */
        $scope.selectedRow = null;                          // Initialize selectedRow to null
        $scope.setClickedRow = function (index) {           // Set the value of the row to current index
            $scope.selectedRow = index;
            $scope.isDisabled = true;
        };

        /**
         * contributionTypeChanged()
         * Function for detecting the selection option being changed; this function specifically handles
         * the dropdown selection option for Contribution Type, where if "Money" is selected, the change in
         * typeStatus triggers hidden input fields to be revealed to fill in information regarding the Money
         * Contribution Type.
         */
        $scope.contributionTypeChanged = function() {
            $scope.typeStatus = $scope.TypeValue;
        };

        /**
         * redirectToContributionForm()
         * Function for re-routing current page to the contribution_form page; this function is invoked
         * when the "Add Entry" button is clicked on the main Contribution view.
         */
        $scope.redirectToContributionForm = function() {
            $window.location.href = "../pages/contribution_form.html";
        };

        /**
         * removeRow($index)
         * @param item: Reference to an item listed in a given data table
         * Function for deleting an entry from the data table in a given view when the red "x" icon is clicked in the
         *  Action column of the entry.
         */
        $scope.removeItem = function(item) {
            console.log(item);
            let tempDonorName = item.donor_name;
            let deleteMessage = "Are you sure you want to delete " + tempDonorName + "?";

            // Prompt user to confirm deletion; clicking OK returns true, Cancel returns false.
            let deleteItem = $window.confirm(deleteMessage);

            // If user clicked OK, handle the deletion.
            if (deleteItem) {
                // NOTE: This only removes items from the DUMMY DATA TABLE in the controller. This needs to be
                //       replaced with deletion code involving Angular/Node
                //$scope.contributions.splice(item, 1);     // Just a placeholder, but will need code to update DB via Node.js?
                let length = $scope.contributions.length;
                for (let i = 0; i < length; i++)
                {
                    if (item === $scope.contributions[i])
                    {
                        $scope.contributions.splice(item, 1);
                        break;
                    }
                }
            }
        };

        /**
         * goToContribution(contribution)
         * @param contribution: Specific entry related to the Contributions main view table
         * Function for pulling up the detailed information page of a selected Contribution entry on the data table
         * displayed in the main Contribution view.
         */
        $scope.goToContribution = function(contribution) {
            window.location.href = '../pages/contribution_basic_info.html';
            sessionStorage.setItem('entityID', contribution.id);

            let cont_name = contribution.cont_name;
            sessionStorage.setItem('entityName', cont_name);

            console.log("click " + sessionStorage.getItem('entityID'));
        };


        ////////////////////////////////// FUNCTIONS FOR FORM SUBMISSION ///////////////////////////////////////
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
         * submitContribution(ContributionForm.$valid)
         * Function to submit the data from a form page to be packaged into JSON format for back-end to store the data.
         * Initializes all the fields with the fields that a new pledge should have when entering the data into the database,
         * and performs a one-time submission to save the entry.
         */
        $scope.submitContribution = function(isValid) {
            let newContribution = {
                itemName: $scope.contribName,
                type: $scope.contribType,
                amount: $filter('number')($scope.contribAmount, 2),
                paymentMethod: $scope.contribPaymentMethod,
                appeal: $scope.contribAppeal,
                destination: $scope.contribDestination,
                isEvent: $scope.isEvent.choice,
                notes: $scope.contribNotes
            };

            // Verify if the entire form is valid or not; if so, run through the procedures of stringifying JSON
            //  data, sending it to the back-end, notifying the user of entry being saved, and then re-route to
            //  main view of Contributions.
            if (isValid)
            {
                // Package the data into JSON format
                console.log(JSON.stringify(newContribution));

                // Send newContribution in JSON format to back-end


                // Notify user that the data is saved/submitted before sending data to backend
                $window.alert("Entry saved!");

                // Re-route user back to main contributions page
                $window.location.href="../pages/all_contributions.html";
            }
        };

        /**
         * submitContributionAndNew(ContributionForm.$valid)
         * Function to submit the data from a form page to be packaged into JSON format for back-end to store the data.
         * Initializes all the fields with the fields that a new pledge should have when entering the data into the database,
         * and asks user if additional entries need to be submitted in addition to the initial entry being saved.
         */
        $scope.submitContributionAndNew = function(isValid) {
            let newContribution = {
                itemName: $scope.contribName,
                type: $scope.contribType,
                amount: $filter('number')($scope.contribAmount, 2),
                paymentMethod: $scope.contribPaymentMethod,
                appeal: $scope.contribAppeal,
                destination: $scope.contribDestination,
                isEvent: $scope.isEvent.choice,
                notes: $scope.contribNotes
            };

            if (isValid) {
                // Package the data into JSON format for back-end server
                console.log(JSON.stringify(newContribution));

                // Send an alert to the user to determine if user intends to add in additional entries
                let newEntryPrompt = $window.confirm("Save current data and create blank entry?");

                // If user wants to add in a new entry
                if (newEntryPrompt) {

                    // Send the current data in newContribution to database


                    // Route user to data entry page
                    $window.location.href = "../pages/contribution_form.html";
                }
                else {
                    $window.location.href = "../pages/all_contributions.html";
                }
            }
        };
    });
}());
