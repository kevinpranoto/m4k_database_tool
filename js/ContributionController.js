(function(){
    let allContributions = angular.module("allContributions", []);
    allContributions.controller("ContributionController", function($scope, $location, $window, $filter, $http) {

        ///////////////////////// RETRIEVAL AND SUBMISSION CODE TO DATABASE //////////////////////////////////
        /**
         * Retrieving data from the database to display onto the main view of a contribution
         * */
        $scope.contributions = [];
        console.log('Retrieving data for Contributions main view...');
        $http.get('http://127.0.0.1:8081/contributions').then((res)=>
        {
            console.log(res.data);
            for (let i in res.data)
            {
                let obj = res.data[i];
                let contribution =
                    {
                        contrib_id : obj.contrib_id,
                        supporter_id: obj.supporter_id,
                        donor_name: obj.first_name + " " + obj.last_name,
                        contrib_name: obj.item_name,
                        contrib_type: obj.contrib_type,
                        contrib_appeal: obj.appeal,
                        contrib_notes: obj.notes,
                    };
                $scope.contributions.push(contribution);
            }
        });
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
            $scope.typeStatus = $scope.contrib_type;
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
         * goToContribution(contribution)
         * @param contribution: Specific entry related to the Contributions main view table
         * Function for pulling up the detailed information page of a selected Contribution entry on the data table
         * displayed in the main Contribution view.
         *
         * The contribution's ID value is saved in cache to be used in ContributionBasicInfoController.
         */
        $scope.goToContribution = function(contribution) {
            // Save contribution ID in cache
            sessionStorage.setItem('contributionID', contribution.contrib_id);

            console.log("click " + sessionStorage.getItem('contributionID'));

            // Re-route to the contribution's specific view with the ID cached for use in ContributionBasicInfoController
            window.location.href = '../pages/contribution_basic_info.html';
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
                item_name: $scope.contrib_name,
                type: $scope.contrib_type,
                amount: $filter('number')($scope.contrib_amount, 2),
                payment_method: $scope.contrib_payment_method,
                appeal: $scope.contrib_appeal,
                destination: $scope.contrib_destination,
                is_event: $scope.is_event.choice,
                notes: $scope.contrib_notes
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
                item_name: $scope.contrib_name,
                type: $scope.contrib_type,
                amount: $filter('number')($scope.contrib_amount, 2),
                payment_method: $scope.contrib_payment_method,
                appeal: $scope.contrib_appeal,
                destination: $scope.contrib_destination,
                is_event: $scope.is_event.choice,
                notes: $scope.contrib_notes
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

    /***
     * New module and controller for handling the specific view of a contribution entity.
     * @type {angular.Module}
     */
    let contributionSpecific = angular.module("contributionSpecific", []);
    contributionSpecific.controller("ContributionBasicInfoController", function($scope, $filter, $http) {

        // Retrieve contribution ID from the cache
        let id = sessionStorage.getItem('contributionID');

        $scope.contributionID = id;
        console.log(id);

        // Retrieve contribution information using the contribution ID from cache
        let getString = 'http://127.0.0.1:8081/contributions/' + id;
        $http.get(getString).then((res)=>
        {
            // Grab the first and only item from the returned database object
            let basic_info = res.data[0];
            console.log(basic_info);

            // Bind all the retrieved information attributes to local scope to display on contribution-specific view
            $scope.item_name = basic_info.item_name;
            $scope.donor_name = basic_info.first_name + " " + basic_info.last_name;
            $scope.contrib_date = $filter('date')(basic_info.contrib_date, "MM-dd-yyyy");
            $scope.is_event_item = basic_info.is_event_item;
            $scope.contrib_type = basic_info.contrib_type;
            $scope.amount = $filter('number')(basic_info.amount, 2);
            $scope.pay_method = basic_info.pay_method;
            $scope.destination = basic_info.destination;
            $scope.appeal = basic_info.appeal;
            $scope.thanked = basic_info.thanked;
            $scope.notes = basic_info.notes;
        });
    });
}());
