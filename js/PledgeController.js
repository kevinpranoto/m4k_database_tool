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
                    target_amount: "$" + $filter('number')(obj.target_amount, 2),
                    pledge_date: $filter('date')(obj.pledge_date, 'MM-dd-yyyy')
                };
                $scope.pledges.push(pledge);
            }

        });

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
            sessionStorage.setItem('isModify', false);
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
         * The pledge's ID value is saved in cache to be used in PledgeBasicInfoController.
         */
        $scope.goToPledge = function(pledge) {
            // Save pledge ID in cache
            sessionStorage.setItem('pledgeID', pledge.pledge_id);
            sessionStorage.setItem('temp_pledge_donorID', pledge.supporter_id);

            console.log("click " + sessionStorage.getItem('pledgeID'));

            // Re-route to the pledge's specific view with the ID cached for use in PledgeBasicInfoController
            window.location.href = '../pages/pledge_basic_info.html';
        };

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
    });


    /***
     * New module and controller for handling the specific view of a pledge entity.
     * @type {angular.Module}
     */
    let pledgeSpecific = angular.module("pledgeSpecific", []);
    pledgeSpecific.controller("PledgeBasicInfoController", function($scope, $filter, $http, $window) {

        // Retrieve pledge ID from the cache
        let id = sessionStorage.getItem('pledgeID');

        $scope.pledgeID = id;
        console.log(id);

        // Retrieve pledge information using the pledge ID from cache
        let getString = 'http://127.0.0.1:8081/pledges/' + id;
        $http.get(getString).then((res)=>
        {
            console.log(res);
            // Grab the first and only item from the returned database object
            let general_info = res.data.basic_info[0];
            let patient_id = res.data.patient_id;
            let donor_info = res.data.donor[0];
            let temp_installments_list = res.data.installments;

            console.log(general_info);
            console.log("Patient ID " + patient_id);
            console.log(donor_info);
            console.log(temp_installments_list);

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

        $scope.editingPledge = function() {
            sessionStorage.setItem('isModify', true);
            sessionStorage.setItem('pledgeID', id);
            sessionStorage.setItem('patientID', $scope.patient_id);
            console.log("Modify Pledge button clicked");
            $window.location.href = '../pages/pledge_form.html';
        };
    });

    let pledgeEntry = angular.module("pledgeEntry", ['ui.directives', 'ui.filters']);
    pledgeEntry.controller("PledgeFormController", function($scope, $http, $filter, $window) {

        // Retrieve isModify value to determine whether certain fields should be disabled or not during modify
        $scope.is_modify_form = sessionStorage.getItem('isModify');

        $scope.temp_installments = [
            {
                amount: '',
                date: ''
            }
        ];

        $scope.addInstallment = function() {
            $scope.temp_installments.push({amount: '', date: '',});
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
                        patient_id: obj.patient_id
                    };

                    $scope.temp_patient_list.push(patient);
                }
            });
            console.log($scope.temp_patient_list);
        };

        $scope.getDonorName = function (current_donor_id) {
            if (current_donor_id !== null) {

                $http.get('http://127.0.0.1:8081/pledges/' + current_donor_id).then((res) => {
                    console.log("GRABBING A SPECIFIC DONOR DATA FOR PLEDGE FORM...");
                    console.log(res.data);
                    let donor_name = res.data.donor.first_name + " " + res.data.donor.last_name;

                    return donor_name;
                });
            }
            return null;
        };


        /***
         * Section for retrieving data to populate into a form page if the user is attempting to modify
         * an existing Pledge entry.
         */
        let is_modify = sessionStorage.getItem('isModify');
        if (is_modify === "true")
        {
            let mod_id = sessionStorage.getItem('pledgeID');
            let don_id = sessionStorage.getItem('temp_pledge_donorID');
            let pat_id = sessionStorage.getItem('patientID');

            console.log("mod_id: " + mod_id);
            console.log("don_id: " + don_id);

            let temp_URL = "http://127.0.0.1:8081/pledges/" + mod_id;
            $http.get(temp_URL).then((res)=> {
                console.log("Attempting to modify:");
                console.log(res.data);

                // Grab the first and only item from the returned database object
                let general_info = res.data.basic_info[0];
                let patient_id = res.data.patient_id;
                let donor_info = res.data.donor[0];
                let temp_installments_list = res.data.installments;
                let pledge_donor_name = donor_info.first_name + " " + donor_info.last_name;
                $scope.pledge_donor_name_for_basic_info = pledge_donor_name;

                // Bind all the retrieved information attributes to local scope to display on pledge modification view
                /***
                 * LHS (ng-model) = RHS (the returned object from server)
                 * Make sure the LHS has matching ng-model name in the form html file
                 * Make sure the RHS has matching attribute name from database
                 */

                $scope.donor_selected = don_id;
                $scope.pledge_patient_id = pat_id;
                $scope.pledge_target_amount = general_info.target_amount;
                $scope.pledge_date = new Date(general_info.pledge_date);

                console.log("dnr slctd:" + $scope.donor_selected);
                console.log("pldg pat id:" + $scope.pledge_patient_id);

                // Need to get the list of installments from the DB retrieval!!


                sessionStorage.setItem("modified_pledge_object", JSON.stringify(res));
            });
        }

        /**
         * Function(s) related to gathering data from form pages and packaging them into JSON format
         */
        $scope.submitPledge = function(isValid, saveAndNew) {

            let temp_pledge_id = sessionStorage.getItem('pledgeID');

            // Check if the data is an existing entry to be modified
            if (is_modify == "true")
            {
                let modifiedPledge = {
                    donor_selected: $scope.donor_selected,
                    pledge_date: $scope.pledge_date,
                    target_amount: $scope.pledge_target_amount,
                    is_behind: false,
                    // NEED TO RETRIEVE THE LIST OF INSTALLMENTS FROM THE DB RETRIEVAL
                    // installments: $scope.installments_list
                };

                console.log("Modified pledge:");
                console.log(modifiedPledge);

                if (isValid) {
                    // Package the data into JSON format and update the existing entry in database
                    let submit_data = JSON.stringify(modifiedPledge);

                    console.log(submit_data);

                    $http.put('http://127.0.0.1:8081/pledges/' + temp_pledge_id, submit_data).then((res) => {
                        console.log(res);
                    });

                    $window.alert("Entry saved!");

                    // Re-route user back to main pledges page
                    $window.location.href = "../pages/pledge_basic_info.html";
                }
            }
            else // this is a new entry, so begin new data form submission
            {
                let installments_list = [
                    {
                        amount: null,
                        installment_date: null
                    }
                ];

                let newPledge = {
                    donor_id: $scope.donor_selected,
                    patient_id: $scope.pledge_patient_id,
                    pledge_date: $scope.pledge_date,
                    target_amount: $scope.pledge_target_amount,
                    is_behind: false,
                    installments: installments_list
                };

                if (isValid) {
                    // Package the data into JSON format and send the current data in newPledge to database
                    let submit_data = JSON.stringify(newPledge);

                    console.log(submit_data);

                    $http.post('http://127.0.0.1:8081/pledges', submit_data).then((res) => {
                        console.log(res);
                    });

                    $window.alert("Entry saved!");

                    // Re-route user back to main pledges page
                    if (saveAndNew == 'toForm') {
                        sessionStorage.setItem('isModify', false);
                        $window.location.href = "../pages/pledge_form.html";
                    }
                    else {
                        $window.location.href = "../pages/all_pledges.html";
                    }
                }
            }
        };

        /**
        $scope.submitPledgeAndNew = function(isValid) {
            let installments_list = [
                {
                    amount: null,
                    installment_date: null
                }
            ];

            let newPledge = {
                donor_id: $scope.donor_selected,
                patient_id: $scope.pledge_patient_id,
                pledge_date: $scope.pledge_date,
                target_amount: $scope.pledge_target_amount,
                is_behind: false,
                installments: installments_list
                //date: $filter('date')($scope.pledge_date, "MM-dd-yyyy")     // Date is filtered to remove clock time
            };
            console.log("new pledge donor id: " + newPledge.donor_id);
            console.log(newPledge);

            if (isValid) {
                // Package the data into JSON format
                let submit_data = JSON.stringify(newPledge);
                console.log(submit_data);

                // Send an alert to the user to determine if user intends to add in additional entries
                let newEntryPrompt = $window.confirm("Save current data and create blank entry?");

                // If user wants to add in a new entry
                if (newEntryPrompt) {

                    $http.post('http://127.0.0.1:8081/pledges', submit_data).then((res)=>
                    {
                        console.log(res);
                        $window.alert("Entry saved!");
                    });
                    // Route user to data entry page
                    $window.location.href = "../pages/pledge_form.html";
                }
                else {

                    $http.post('http://127.0.0.1:8081/pledges', submit_data).then((res)=>
                    {
                        console.log(res);
                        $window.alert("Entry saved!");
                    });
                    $window.location.href = "../pages/all_pledges.html";
                }
            }
        };
         */
    });
}());