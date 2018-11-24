(function (){

    let allPledges = angular.module('allPledges', []);

    allPledges.controller('PledgeController', function($scope, $location, $window) {

        $scope.pledges = [
            {id : '1', donor_name : 'Jack Stefanski', patient_id : '7134', target_amount : '100,000.00', target_year: '2040', pledge_date: '11/24/2018'},
            {id : '2', donor_name : 'Bob Bobberson', patient_id : '1234', target_amount : '1.00', target_year: '2020', pledge_date: '11/21/2018'},
            {id : '3', donor_name : 'Honk Honkerson', patient_id : '52321', target_amount : '2,000.00', target_year: '2030', pledge_date: '11/11/2018'}
        ];

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