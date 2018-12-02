var allEventItems = angular.module('allEventItems', []);

allEventItems.controller('eventItemsTable', function($scope, $location, $window, $http) {
    
    $scope.items = [];
    
    $http.get('http://127.0.0.1:8081/eventItems').then((res)=>
    {
        console.log(res.data);
        for (var i in res.data)
        {
            var obj = res.data[i];
            var item = { id: obj.contrib_id, donor_name: obj.first_name + ' ' + obj.last_name, item_name: obj.item_name, type: obj.contrib_type, appeal: obj.appeal, notes: obj.notes};
            $scope.items.push(item);
        }
    });

    $scope.selectedRow = null;                          // Initialize selectedRow to null
    $scope.setClickedRow = function (index) {           // Set the value of the row to current index
        $scope.selectedRow = index;
        $scope.isDisabled = true;
    };

    function set(data) {
        donorID = data;
    };

    function get() {
        console.log("called");
        return donorID;
    };
    
    $scope.goToEventItem = function(item) {
        sessionStorage.setItem('entityID', donor.id);
        sessionStorage.setItem('entityName', donor.name)
        console.log("click " + sessionStorage.getItem('entityID'));
        window.location.href = '../pages/contribution_basic_info.html';
    };
    /*
    return {
        set: set,
        get: get
    };*/
});