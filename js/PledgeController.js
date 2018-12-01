(function (){

    let allPledges = angular.module('allPledges', []);

    allPledges.controller('PledgeController', function($scope, $location, $window, $filter, $http) {

        $scope.pledges = [];

        $http.get('http://127.0.0.1:8081/pledges').then((res) =>
        {
            for(var i in res.data)
            {
                console.log(res.data);
                var obj = res.data[i];
                var pledge = { donor_name: obj.first_name+' '+obj.last_name, patient_id: obj.patient_id, 
                    target_amount: obj.target_amount, pledge_date: obj.pledge_date};
                $scope.pledges.push(pledge); 
            }
        });

        /**
         *  Function for providing the ability to highlight any given entry in a data table.
         */
        $scope.selectedRow = null;                          // Initialize selectedRow to null
        $scope.setClickedRow = function (index) {           // Set the value of the row to current index
            $scope.selectedRow = index;
            $scope.isDisabled = true;
        };

        /**
         * Directs current page to the Pledge Form page
         */
        $scope.redirectToPledgeForm = function() {
            $window.location.href = "../pages/pledge_form.html";
        };

        /**
         * Function to display a dynamic list of calendar years based off current year. Returns a list of years
         * to be parsed through and displayed as an option item in a selection list.
         */
        $scope.calendarList = function(){
            let year = new Date().getFullYear();
            let range = [];
            range.push(year);

            let max_year_length = 50;                        // Arbitrary value of 50 set
            for (let i = 1; i < max_year_length; i++)
            {
                range.push(year + i);
            }

            $scope.list_of_years = range;
        };

        $scope.pickDate = function() {
            this.myDate = new Date();
            this.isOpen = false;
        };

        $scope.saveEntry = function(){

        };

        $scope.removeRow = function(index, pledge){
            // Prompt user to confirm deletion; clicking OK returns true, Cancel returns false.
            let deleteRow = $window.confirm("Are you sure you want to delete this entry?");

            // If user clicked OK, handle the deletion.
            if (deleteRow) {

                function find_data(items) {
                    return items.id === pledge.id;
                }

                $scope.pledges.splice(index, 1);     // Just a placeholder, but will need code to update DB via Node.js?
                let to_delete = $scope.items.find(find_data);

                let index = $scope.items.indexOf(to_delete);

                $scope.pledges.splice(index,1);
            }
        };

        $scope.goToContribution = function(pledge) {
            window.location.href = '../pages/pledge_basic_info.html';
            sessionStorage.setItem('entityID', pledge.id);
            let pledge_name = pledge.cont_name + " pledges to " + pledge.patient_id;
            sessionStorage.setItem('entityName', pledge_name)
            console.log("click " + sessionStorage.getItem('entityID'));
        };

        /**
         * Function(s) related to gathering data from form pages and packaging them into JSON format
         */
        $scope.submitPledge = function() {
            let newPledge = {
                donorName: $scope.pledgeDonorName,
                patientID: $scope.pledgePatientID,
                date: $filter('date')($scope.pledgeDate, "MM-dd-yyyy"),     // Date is filtered to remove clock time
                targetAmount: $scope.pledgeTargetAmount,
                targetYear: $scope.pledgeTargetYear,
                notes: $scope.pledgeNotes
            }

            console.log(JSON.stringify(newPledge));
            //send donor here to server
        };
    });
}());


angular.module('app', [])
    .controller("Ctrl",
        function contactListCtrl($scope) {

            var year = new Date().getFullYear();
            var range = [];
            range.push(year);
            for (var i = 1; i < 7; i++) {
                range.push(year + i);
            }
            $scope.years = range;


        });