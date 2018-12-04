(function (){
    let allPledges = angular.module('allPledges', ['ui.directives', 'ui.filters']);
    allPledges.controller('PledgeController', function($scope, $location, $window, $filter, $http) {

        ///////////////////////// RETRIEVAL AND SUBMISSION CODE TO DATABASE //////////////////////////////////
        /**
         * Retrieving data from the database to display onto the main view of a pledge
         * */
        $scope.pledges = [];

        console.log('Retrieving data for Pledges main view...');
        $http.get('http://127.0.0.1:8081/pledges').then((res)=>
        {
            console.log(res.data);
            for (let i in res.data)
            {
                let obj = res.data[i];
                let pledge =
                {
                    pledge_id : obj.pledge_id,
                    supporter_id: obj.supporter_id,
                    donor_name: obj.first_name + " " + obj.last_name,
                    patient_id: obj.patient_id,
                    target_amount: $filter('number')(obj.target_amount, 2),
                    pledge_date: $filter('date')(obj.pledge_date, 'MM-dd-yyyy')
                };
                $scope.pledges.push(pledge);
            }
        });

        /**
         * removeEntries()
         * Sends delete requests to the backend server with a list of object ID's to be deleted.
         * Also refreshes main page if anything gets deleted; if not, remains on same page.
         */
        $scope.removeEntries = function() {
            let something_deleted = false;
            $scope.pledges.forEach(pled => {
                if (pled.to_remove === true) {
                    let deletePrompt = $window.confirm("Delete " + pled.donor_name + "'s pledge? (Deletion cannot be reverted)");
                    if (deletePrompt) {
                        something_deleted = true;
                        console.log("Deleting " + pled.pledge_id);
                        $http.delete('http://127.0.0.1:8081/pledges/' + pled.pledge_id);
                    }
                }
            });
            if (something_deleted) {
                window.location.href = '../pages/all_pledges.html';
            }
        };

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
         * redirectToPledgeForm()
         * Function for re-routing current page to the pledge_form page; this function is invoked
         * when the "Add Entry" button is clicked on the main Pledges view.
         */
        $scope.redirectToPledgeForm = function() {
            $window.location.href = "../pages/pledge_form.html";
        };

        /**
         * calendarList()
         * Function to dynamically display a dynamic list of calendar years based off current year.
         * Returns a list of year to be parsed through and displayed as an option item in a selection list.
         */
        $scope.calendarList = function(){
            let year = new Date().getFullYear();             // Get current year
            let range = [];
            range.push(year);                                // List starts from current year

            let max_year_length = 50;                        // Arbitrary value of 50 set to get from current year to 50 years ahead
            for (let i = 1; i < max_year_length; i++)
            {
                range.push(year + i);
            }

            $scope.list_of_years = range;
        };

        /**
         * goToPledge(pledge)
         * @param pledge: Specific entry related to the Pledge main view table
         * Function for pulling up the detailed information page of a selected Pledge entry on the data table
         * displayed in the main Pledge view.
         *
         * The contribution's ID value is saved in cache to be used in ContributionBasicInfoController.
         */
        $scope.goToPledge = function(pledge) {
            // Save pledge ID in cache
            sessionStorage.setItem('pledgeID', pledge.pledge_id);

            console.log("click " + sessionStorage.getItem('pledgeID'));

            // Re-route to the contribution's specific view with the ID cached for use in PledgeBasicInfoController
            window.location.href = '../pages/pledge_basic_info.html';
        };

        /**
         * Function(s) related to gathering data from form pages and packaging them into JSON format
         */
        $scope.submitPledge = function(isValid) {

            let installments_list = [
                {
                    amount: null,
                    installment_date: null
                }
            ];

            let newPledge = {
                donor_id: $scope.donor_selected,
                patient_id: $scope.pledge_patient_id,
                pledge_date: $scope.pledge_target_year,
                target_amount: $filter('number')($scope.pledge_target_amount, 2),
                is_behind: false,
                installments: installments_list,
            };

            console.log(newPledge);

            if (isValid)
            {
                // Package the data into JSON format and send the current data in newContribution to database
                let submit_data = JSON.stringify(newPledge);

                $http.post('http://127.0.0.1:8081/pledges', submit_data).then((res)=>
                {
                    console.log(res);
                    $window.alert("Entry saved!");
                });

                // Re-route user back to main contributions page
                //$window.location.href="../pages/all_pledges.html";
            }
        };

        $scope.submitPledgeAndNew = function(isValid) {
            let cached_donor_id = sessionStorage.getItem('entityID');
            let cached_patient_id = sessionStorage.getItem('patientID');

            let installments_list = [
                {
                    amount: null,
                    installment_date: null
                }
            ];

            let newPledge = {
                donor_id: $scope.donor_item.key,  ///// THIS NEEDS TO BE THE DONOR ID OF THE DROPDOWN ITEM
                patient_id: $scope.pledge_patient_id,
                pledge_date: $scope.pledge_target_year,
                target_amount: $filter('number')($scope.pledge_target_amount, 2),
                is_behind: false,
                installments: installments_list,
                //date: $filter('date')($scope.pledge_date, "MM-dd-yyyy")     // Date is filtered to remove clock time
            };
            console.log("new pledge donor id: " + newPledge.donor_id);
            console.log(newPledge);

            if (isValid) {
                // Package the data into JSON format
                let submit_data = JSON.stringify(newPledge);

                // Send an alert to the user to determine if user intends to add in additional entries
                let newEntryPrompt = $window.confirm("Save current data and create blank entry?");

                // If user wants to add in a new entry
                if (newEntryPrompt) {

                    $http.post('http://127.0.0.1:8081/pledges', submit_data).then((res)=>
                    {
                        $window.alert("Entry saved!");
                    });
                    // Route user to data entry page
                    $window.location.href = "../pages/pledge_form.html";
                }
                else {

                    $http.post('http://127.0.0.1:8081/pledges', submit_data).then((res)=>
                    {
                        $window.alert("Entry saved!");
                    });
                    $window.location.href = "../pages/all_pledges.html";
                }
            }
        };

        /***
         * getDropdownDonors()
         * Helper function to retrieve all the donor names from the database for populating the dropdown menu
         * for creating a new pledge. Prevents user from manually entering names and avoids redundancies or
         * mismatching in the database when associating donors and patients with pledges.
         */
        $scope.getDropdownDonors = function(){
            $scope.temp_donor_list = [];
            $http.get('http://127.0.0.1:8081/donors').then((res)=>
            {
                console.log("GRABBING DONORS DATA FOR PLEDGE FORM...")
                console.log(res.data);
                for (let i in res.data)
                {
                    let obj = res.data[i];
                    let donor = {
                        id: obj.supporter_id,
                        name: obj.first_name + " " + obj.last_name
                    };

                    $scope.temp_donor_list.push(donor);
                }
            });
            console.log($scope.temp_donor_list);
        };

        /***
         * getDropdownPatients()
         * Helper function to retrieve all the patient IDs from the database for populating the dropdown menu
         * for creating a new pledge. Prevents user from manually entering patient IDs and avoids redundancies or
         * mismatching in the database when associating donors and patients with pledges.
         */
        $scope.getDropdownPatients = function(){
            $scope.temp_patient_list = [];
            $http.get('http://127.0.0.1:8081/patients').then((res)=>
            {
                console.log("GRABBING PATIENT ID's FOR PLEDGE FORM...")
                console.log(res.data);
                for (let i in res.data)
                {
                    let obj = res.data[i];
                    let patient = {
                        id: obj.patient_id
                    };

                    $scope.temp_patient_list.push(patient);
                }
            });
            console.log($scope.temp_patient_list);
        };

        $scope.getDonorName = function (current_donor_id) {
            if (current_donor_id !== null) {

                $http.get('http://127.0.0.1:8081/pledges/' + current_donor_id).then((res) => {
                    console.log("GRABBING A SPECIFIC DONOR DATA FOR PLEDGE FORM...")
                    console.log(res.data);
                    let temp_donor_name = res.data.donor.first_name + " " + res.data.donor.last_name;
                    return temp_donor_name;
                });
            }
            return null;
        };
    });

    /***
     * New module and controller for handling the specific view of a pledge entity.
     * @type {angular.Module}
     */
    let pledgeSpecific = angular.module("pledgeSpecific", []);
    pledgeSpecific.controller("PledgeBasicInfoController", function($scope, $filter, $http) {

        // Retrieve contribution ID from the cache
        let id = sessionStorage.getItem('pledgeID');

        $scope.pledgeID = id;
        console.log(id);

        // Retrieve pledge information using the pledge ID from cache
        let getString = 'http://127.0.0.1:8081/pledges/' + id;
        $http.get(getString).then((res)=>
        {
            // Grab the first and only item from the returned database object
            let general_info = res.data.basic_info[0];
            let patient_id = res.data.patient_id;
            let donor_info = res.data.donor[0];
            let temp_installments_list = res.data.installments;

            // Bind all the retrieved information attributes to local scope to display on pledge-specific view
            $scope.donor_name = donor_info.first_name + " " + donor_info.last_name;
            $scope.alias = donor_info.alias;
            $scope.patient_id = patient_id;
            $scope.pledge_date = $filter('date')(general_info.pledge_date, 'MM-dd-yyyy');
            $scope.target_amount = $filter('number')(general_info.target_amount, 2);
            $scope.is_behind = general_info.is_behind;

            $scope.installments_list = [];

            // Modularized to store donor's multiple pledge installment dates
            for (let i = 0; i < temp_installments_list.length; i++)
            {
                $scope.installments_list.push(temp_installments_list[i]);

                // Converts the date into MM-dd-yyyy format
                $scope.installments_list[i].installment_date = $filter('date')( $scope.installments_list[i].installment_date, 'MM-dd-yyyy')
            }
        });
    });
}());