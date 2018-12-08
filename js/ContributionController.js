(function(){
    let allContributions = angular.module("allContributions", ['ui.directives', 'ui.filters']);
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
            sessionStorage.setItem('isModify', 'false');
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
            sessionStorage.setItem('entityID', contribution.supporter_id);

            console.log("click " + sessionStorage.getItem('contributionID'));

            // Re-route to the contribution's specific view with the ID cached for use in ContributionBasicInfoController
            window.location.href = '../pages/contribution_basic_info.html';
        };

        /**
         * removeEntries()
         * Sends delete requests to the backend server with a list of object ID's to be deleted.
         * Also refreshes main page if anything gets deleted; if not, remains on same page.
         */
        $scope.removeEntries = function() {
            let something_deleted = false;
            $scope.contributions.forEach(cont => {
                console.log(cont);
                if (cont.to_remove === true) {
                    let deletePrompt = $window.confirm("Delete " + cont.contrib_name + "? (Deletion cannot be reverted)");
                    if (deletePrompt) {
                        something_deleted = true;
                        console.log("Deleting " + cont.contrib_id);
                        $http.delete('http://127.0.0.1:8081/contributions/' + cont.contrib_id);
                    }
                }
            });
            if (something_deleted) {
                window.location.href = '../pages/all_contributions.html';
            }
        };
    });


    /***
     * New module and controller for handling the specific view of a contribution entity.
     * @type {angular.Module}
     */
    let contributionSpecific = angular.module("contributionSpecific", []);
    contributionSpecific.controller("ContributionBasicInfoController", function($scope, $filter, $http, $window) {

        // Retrieve contribution ID from the cache
        let id = sessionStorage.getItem('contributionID');

        console.log("CURRENT ID @ NEW CONTRIB: " + id);

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
            $scope.amount = "$" + $filter('number')(basic_info.amount, 2);
            $scope.pay_method = basic_info.pay_method;
            $scope.destination = basic_info.destination;
            $scope.appeal = basic_info.appeal;
            $scope.thanked = basic_info.thanked;
            $scope.notes = basic_info.notes;
        });

        $scope.editingContribution = function() {
            sessionStorage.setItem('isModify', true);
            sessionStorage.setItem('contributionID', id);
            console.log("Modify Contribution button clicked");
            $window.location.href = '../pages/contribution_form.html';
        };
    });


    let contributionEntry = angular.module("contributionEntry", []);
    contributionEntry.controller("ContributionFormController", function($scope, $http, $filter, $window) {

        // Retrieve isModify value for certain fields or buttons to be disabled during modification
        $scope.is_modify_form = sessionStorage.getItem('isModify');

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
            'Direct Mail', 'Email Campaign', 'Radio Ad', 'Sponsorship',
            'Fund-a-Need', 'Opportunity Ticket', 'Silent Auction', 'Live Auction'
        ];

        $scope.contribDestinations = [
            'General', 'Miracle Manor', 'Basket of Miracles', 'Grant Program', 'Health & Wellness'
        ];

        $scope.contribIsEventChoices = [
            'Yes', 'No'
        ];

        /***
         * Section for retrieving data to populate into a form page if the user is attempting to modify
         * an existing Contribution entry.
         */
        let is_modify = sessionStorage.getItem('isModify');
        if (is_modify === "true")
        {
            let mod_id = sessionStorage.getItem('contributionID');
            let don_id = sessionStorage.getItem('entityID');
            console.log("mod_id: " + mod_id);
            console.log("don_id: " + don_id);

            let temp_URL = "http://127.0.0.1:8081/contributions/" + mod_id;
            $http.get(temp_URL).then((res)=> {
                let obj = res.data[0];
                console.log("Attempting to modify:");
                console.log(obj);

                /***
                 * LHS (ng-model) = RHS (the returned object from server)
                 * Make sure the LHS has matching ng-model name in the html file
                 * Make sure the RHS has matching attribute name from database
                 */
                $scope.item_name = obj.item_name;
                $scope.is_event_item = obj.is_event_item;
                $scope.contrib_type = obj.contrib_type;
                $scope.amount = obj.amount;
                $scope.payment_method = obj.pay_method;
                $scope.destination = obj.destination;
                $scope.notes = obj.notes;
                $scope.appeal = obj.appeal;
                $scope.thanked = obj.thanked;
                $scope.supporter_id = don_id;
                $scope.last_name = obj.last_name;
                $scope.first_name = obj.first_name;
                $scope.contrib_date = new Date(obj.contrib_date);

                sessionStorage.setItem("modified_contribution_object", JSON.stringify(obj));
            });
        }
        ////////////////////////////////// FUNCTIONS FOR FORM SUBMISSION ///////////////////////////////////////

        /**
         * submitContribution(ContributionForm.$valid)
         * Function to submit the data from a form page to be packaged into JSON format for back-end to store the data.
         * Initializes all the fields with the fields that a new pledge should have when entering the data into the database,
         * and performs a one-time submission to save the entry.
         */
        $scope.submitContribution = function(isValid, saveAndNew) {

            //let contribution_object = sessionStorage.getItem('contribution_object');
            // If this entry is for modifying existing entry,

            let temp_contribution_id = sessionStorage.getItem('contributionID');
            let temp_supporter_id = sessionStorage.getItem('entityID');

            // Check if the data is an existing entry to be modified
            if (is_modify === 'true')
            {
                console.log("is_modify:" + is_modify);
                let modifiedContribution = {
                    donor_id: temp_supporter_id,
                    contrib_date: $scope.contrib_date,
                    item_name: $scope.item_name,
                    is_event_item: $scope.is_event_item,
                    contrib_type: $scope.contrib_type,
                    amount: $scope.amount,
                    pay_method: $scope.payment_method,
                    destination: $scope.destination,
                    notes: $scope.notes,
                    appeal: $scope.appeal,
                    thanked: $scope.thanked
                };

                if (modifiedContribution.contrib_type !== 'Money') {
                    modifiedContribution.amount = null;
                    modifiedContribution.pay_method = null;
                }

                console.log("Modified contribution:");
                console.log(modifiedContribution);

                if (isValid) {
                    // Package the data into JSON format
                    let submit_data = JSON.stringify(modifiedContribution);

                    let temp_URL = 'http://127.0.0.1:8081/contributions/' + temp_contribution_id;
                    $http.put(temp_URL, modifiedContribution).then((res) => {
                        console.log(res);
                    });

                    $window.alert("Entry saved!");

                    console.log("Data being submitted:");
                    console.log(submit_data);

                    // Re-route user back to main contributions page
                    $window.location.href = "../pages/contribution_basic_info.html";
                }
            }
            else // this is a new entry, so begin new data form submission
            {
                console.log("is_modify:" + is_modify);
                let newContribution = {
                    donor_id: temp_supporter_id,
                    contrib_date: $scope.contrib_date,
                    item_name: $scope.item_name,
                    is_event_item: $scope.is_event_item,
                    contrib_type: $scope.contrib_type,
                    amount: $scope.amount,
                    pay_method: $scope.payment_method,
                    destination: $scope.destination,
                    notes: $scope.notes,
                    appeal: $scope.appeal,
                    thanked: 'false'
                };

                if (newContribution.contrib_type !== 'Money') {
                    newContribution.amount = null;
                    newContribution.pay_method = null;
                }

                console.log("New contribution:");
                console.log(newContribution);

                // Verify if the entire form is valid or not; if so, run through the procedures of stringifying JSON
                //  data, sending it to the back-end, notifying the user of entry being saved, and then re-route to
                //  main view of Contributions.
                if (isValid) {
                    // Package the data into JSON format
                    let submit_data = JSON.stringify(newContribution);

                    $http.post('http://127.0.0.1:8081/contributions', submit_data).then((res) => {
                        console.log(res);
                    });

                    $window.alert("Entry saved!");

                    console.log("Data being submitted:");
                    console.log(submit_data);

                    // Re-route user back to main contributions page
                    if (saveAndNew =='toForm') {
                        sessionStorage.setItem('isModify', false);
                        $window.location.href = "../pages/contribution_form.html";
                    }
                    else {
                        $window.location.href = "../pages/all_contributions.html";
                    }
                }
            }
        };
    });
}());
