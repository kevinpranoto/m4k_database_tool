(function (){
    /**
     *  Controller for handling overall Pledge-related operations.
     *  @module_name: allPledges
     *  @controller_name: PledgeController
     *  @dependencies:
     *      ui.directives, ui.filters - For filtering unique ID's in drop-down displays for pledge forms
     **/
    let allPledges = angular.module('allPledges', ['ui.directives', 'ui.filters']);
    allPledges.controller('PledgeController', function($scope, $location, $window, $filter, $http) {

        /**
         * Retrieving data from the database to display onto the main view of a pledge
         **/
        $scope.pledges = [];

        console.log('Retrieving data for Pledges main view...');
        $http.get('http://127.0.0.1:8081/pledges').then((res)=>
        {
            console.log(res.data);
            for (let i in res.data)
            {
                let obj = res.data[i];

                // Create instance of a newly retrieved pledge entry from the database.
                let pledge =
                {
                    pledge_id : obj.pledge_id,
                    supporter_id: obj.supporter_id,
                    donor_name: obj.first_name + " " + obj.last_name,
                    patient_id: obj.patient_id,
                    target_amount: "$" + $filter('number')(obj.target_amount, 2),
                    pledge_date: $filter('date')(obj.pledge_date, 'MM-dd-yyyy'),
                    is_behind: obj.is_behind,
                    installments: obj.installments
                };

                // For each pledge entry retrieved from the database, push them onto a master list of pledges
                //  to be displayed on the main view for Pledges.
                $scope.pledges.push(pledge);

                console.log(pledge.installments);
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
         * @params: N/A
         * Function for re-routing current page to the pledge_form page; this function is invoked
         * when the "Add Entry" button is clicked on the main Pledges view.
         */
        $scope.redirectToPledgeForm = function() {
            sessionStorage.setItem('isModify', false);
            $window.location.href = "../pages/pledge_form.html";
        };

        /**
         * calendarList()
         * @params: N/A
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
         * @params:
         *          pledge - Specific entry related to the Pledge main view table
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
         * @params: N/A
         * Sends delete requests to the backend server with a list of object ID's to be deleted.
         * Also refreshes main page if anything gets deleted; if not, remains on same page.
         */
        $scope.removeEntries = function() {
            let something_deleted = false;

            // Go through every entry in master list of pledges to check for whether the entry was marked for deletion.
            $scope.pledges.forEach(pled => {
                if (pled.to_remove === true) {
                    // Confirm with user FOR EACH ENTRY MARKED FOR DELETION if deletion is intended.
                    let deletePrompt = $window.confirm("Delete " + pled.donor_name + "'s pledge? (Deletion cannot be reverted)");

                    // If user confirmed the delete, remove entry from the database.
                    if (deletePrompt) {
                        something_deleted = true;
                        console.log("Deleting " + pled.pledge_id);
                        $http.delete('http://127.0.0.1:8081/pledges/' + pled.pledge_id);
                    }
                }
            });
            // If deletion occurred, refresh the page; otherwise, do nothing and remain on the current view.
            if (something_deleted) {
                window.location.href = '../pages/all_pledges.html';
            }
        };
    });


    /**
     *  Controller for handling specific Pledge view related operations.
     *  @module_name: pledgeSpecific
     *  @controller_name: PledgeBasicInfoController
     *  @dependencies: N/A
     **/
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

            // Bind all the retrieved information attributes to local scope to display on pledge-specific view
            $scope.donor_name = donor_info.first_name + " " + donor_info.last_name;
            $scope.alias = donor_info.alias;
            $scope.patient_id = patient_id;
            $scope.pledge_date = $filter('date')(general_info.pledge_date, 'MM/dd/yyyy');
            $scope.target_amount = "$" + $filter('number')(general_info.target_amount, 2);
            $scope.is_behind = general_info.is_behind;
            $scope.basic_info_installments_list = temp_installments_list;

            // Loop through all the installment entries and format the amounts and dates
            $scope.basic_info_installments_list.forEach((item) =>{
                item.amount = $filter('number')(item.amount, 2);
                item.installment_date = $filter('date')(item.installment_date, "MM/dd/yyyy");
            });

            console.log($scope.basic_info_installments_list);
        });

        /***
         * editingPledge()
         * @params: N/A
         * Function for storing critical uniqueID values into cache between current view and handling modification for
         * existing entries in the database. The 'isModify' flag is toggled to 'true' to indicate that the re-routing
         * to a pledge form is for modifying an existing entry instead of creating a new entry.
         */
        $scope.editingPledge = function() {
            sessionStorage.setItem('isModify', true);
            sessionStorage.setItem('pledgeID', id);
            sessionStorage.setItem('patientID', $scope.patient_id);
            console.log("Modify Pledge button clicked");
            $window.location.href = '../pages/pledge_form.html';
        };
    });

    /**
     *  Controller for handling Pledge entry related operations.
     *  @module_name: pledgeEntry
     *  @controller_name: PledgeFormController
     *  @dependencies:
     *      ui.directives, ui.filters - For filtering unique ID's in drop-down displays for pledge forms
     **/
    let pledgeEntry = angular.module("pledgeEntry", ['ui.directives', 'ui.filters']);
    pledgeEntry.controller("PledgeFormController", function($scope, $http, $filter, $window) {

        // Retrieve isModify value to determine whether certain fields should be disabled or not during modify
        $scope.is_modify_form = sessionStorage.getItem('isModify');

        /***
         * addInstallment()
         * @params: N/A
         * Helper function to create a new installments list for when user clicks on "Add Installment" button on the
         * entry form page for both new and existing entries.
         */
        $scope.addInstallment = function() {
            $scope.temp_installments.push({amount: '', date: ''});
        };

        /***
         * getDropdownDonors()
         * @params: N/A
         * Helper function to retrieve all the donor names from the database for populating the dropdown menu
         * for creating a new pledge. Prevents user from manually entering names and avoids redundancies or
         * mismatching in the database when associating donors and patients with pledges.
         */
        $scope.getDropdownDonors = function(){
            // Create temporary list to store donors from the database.
            $scope.temp_donor_list = [];

            // Retrieve all donors from the database.
            $http.get('http://127.0.0.1:8081/donors').then((res)=>
            {
                console.log(res.data);

                // Populate the temporary donor list with all the donors from the database.
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
         * @params: N/A
         * Helper function to retrieve all the patient IDs from the database for populating the drop-down menu
         * for creating a new pledge. Prevents user from manually entering patient IDs and avoids redundancies or
         * mismatching in the database when associating donors and patients with pledges.
         */
        $scope.getDropdownPatients = function(){
            // Create temporary list to store all patients from database.
            $scope.temp_patient_list = [];

            // Get all patients from the database.
            $http.get('http://127.0.0.1:8081/patients').then((res)=>
            {
                console.log(res.data);

                // Store all patients from the database into temporary list of patients.
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

        /***
         * getDonorName()
         * @params:
         *          current_donor_id - Donor ID of the current specific pledge page
         * Helper function to retrieve a specific donor name.
         */
        $scope.getDonorName = function (current_donor_id) {
            if (current_donor_id !== null) {
                $http.get('http://127.0.0.1:8081/pledges/' + current_donor_id).then((res) => {
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

        // If the flag for modifying an existing entry is true...
        if (is_modify === "true")
        {
            // Grab all the required uniqueID's to populate a form page with existing entry's datas.
            let mod_id = sessionStorage.getItem('pledgeID');
            let don_id = sessionStorage.getItem('temp_pledge_donorID');
            let pat_id = sessionStorage.getItem('patientID');

            console.log("mod_id: " + mod_id);
            console.log("don_id: " + don_id);

            // Retrieve the information specific to the pledge ID from the database.
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

                console.log(temp_installments_list);

                // Use for form pages when donor name is needed
                $scope.pledge_donor_name_for_basic_info = pledge_donor_name;

                // Bind all the retrieved information attributes to local scope to display on pledge modification view
                /***
                 * SPECIAL NOTES:
                 * LHS (ng-model) = RHS (the returned object from server)
                 * Make sure the LHS has matching ng-model name in the form html file
                 * Make sure the RHS has matching attribute name from database
                 */
                $scope.donor_selected = don_id;
                $scope.pledge_patient_id = pat_id;
                $scope.pledge_target_amount = general_info.target_amount;
                $scope.pledge_date = new Date(general_info.pledge_date);

                $scope.temp_installments = [];

                temp_installments_list.forEach((installment) => {
                    installment.installment_date = new Date(installment.installment_date);
                    $scope.temp_installments.push(installment);
                });

                sessionStorage.setItem("modified_pledge_object", JSON.stringify(res));
            });
        }

        /***
         * submitPledge()
         * @params:
         *          isValid - Boolean flag specific for whether an entry page's fields have been correctly filled out
         *                    for all required fields.
         *          saveAndNew - String to behave as a flag for whether user clicked on "Save" or "Save And New" button
         *                       when submitting data through the entry page.
         *
         * Function to handle submitting new or modified data from the entry form page to the database.
         */
        $scope.submitPledge = function(isValid, saveAndNew) {

            let temp_pledge_id = sessionStorage.getItem('pledgeID');

            // Check if the data is an existing entry to be modified
            if (is_modify == "true")
            {
                // Create an instance of the existing entry and populate the form fields with their values.
                let modifiedPledge = {
                    donor_selected: $scope.donor_selected,
                    pledge_date: $scope.pledge_date,
                    target_amount: $scope.pledge_target_amount,
                    is_behind: false,
                    installments: $scope.temp_installments
                };

                console.log("Modified pledge:");
                console.log(modifiedPledge);

                // Check if user has correctly filled out all the data fields.
                if (isValid) {
                    // Package the data into JSON format and update the existing entry in database
                    let submit_data = JSON.stringify(modifiedPledge);

                    console.log(submit_data);

                    // Update database with modified fields for currently existing entry.
                    $http.put('http://127.0.0.1:8081/pledges/' + temp_pledge_id, submit_data).then((res) => {
                        console.log(res);
                    });

                    $window.alert("Entry saved!");

                    // Re-route user back to main pledges page
                    window.location.href = "../pages/pledge_basic_info.html";
                }
            }
            else // this is a new entry, so begin new data form submission
            {
                // Create new instance of entry and populate its attributes with the input values from the input fields.
                let newPledge = {
                    donor_id: $scope.donor_selected,
                    patient_id: $scope.pledge_patient_id,
                    pledge_date: $scope.pledge_date,
                    target_amount: $scope.pledge_target_amount,
                    is_behind: false,
                    installments: $scope.temp_installments
                };

                console.log(newPledge.installments);

                // Check if user entered all required fields.
                if (isValid) {
                    // Package the data into JSON format and send the current data in newPledge to database
                    let submit_data = JSON.stringify(newPledge);

                    console.log(submit_data);

                    // Send new entry to the database to be saved.
                    $http.post('http://127.0.0.1:8081/pledges', submit_data).then((res) => {
                        console.log(res);
                    });

                    $window.alert("Entry saved!");

                    // Re-route user back to new clean entry form or to the main page depending on which save button
                    //  is clicked.
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
    });
}());