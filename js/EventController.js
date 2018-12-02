var allStaff = angular.module('allEvents', []);
<<<<<<< HEAD
var eventSpecific = angular.module('eventSpecific', []);
=======
var entitySpecific = angular.module('entitySpecific', []);
>>>>>>> 9368237f50adddc4b9ce82d46fd6a3a6b29642b0

allStaff.controller('EventController', function($scope, $location, $window, $http) {

    $scope.events = [];

    $http.get('http://127.0.0.1:8081/events').then((res) =>
    {
<<<<<<< HEAD
        for (var i in res.data)
        {
            var obj = res.data[i];
            var event = { id: obj.campaign_id, name: obj.campaign_name, date: obj.campaign_date, theme: obj.theme}
=======
        console.log(res.data);
        for (var i in res.data)
        {
            var obj = res.data[i];
            var event = { id: obj.event_id, name: obj.campaign_name, date: obj.campaign_date, theme: obj.theme}
>>>>>>> 9368237f50adddc4b9ce82d46fd6a3a6b29642b0
            $scope.events.push(event);
        }
    });

    let staffID = {};

    function set(data) {
        staffID = data;
    }

    function get() {
        console.log("called");
        return staffID;
    }

    /* Function for providing the ability to highlight any given entry in a data table. */
    $scope.selectedRow = null;                          // Initialize selectedRow to null
    $scope.setClickedRow = function (index) {           // Set the value of the row to current index
        $scope.selectedRow = index;
        $scope.isDisabled = true;
    };

    /* Function to redirect the user from Staff View to data entry form for a new Staff object upon clicking
    *  the "Add Entry" button. */
<<<<<<< HEAD
    $scope.redirectToEventForm = function(){
        $window.location.href = '../pages/event_form.html';
=======
    $scope.redirectToStaffForm = function(){
        $window.location.href = '../pages/staff_form.html';
>>>>>>> 9368237f50adddc4b9ce82d46fd6a3a6b29642b0
    };

    $scope.removeRow = function(index){

        // Prompt user to confirm deletion; clicking OK returns true, Cancel returns false.
        let deleteRow = $window.confirm("Are you sure you want to delete this entry?");

        // If user clicked OK, handle the deletion.
        if (deleteRow) {
<<<<<<< HEAD
            events.splice(index, 1);     // Just a placeholder, but will need code to update DB via Node.js?
        }
    };

    $scope.goToEvent = function(event) {
        $window.location.href = '../pages/event_basic_info.html';
        sessionStorage.setItem('entityID', event.id);
        sessionStorage.setItem('entityName', event.name);
=======
            staff_members.splice(index, 1);     // Just a placeholder, but will need code to update DB via Node.js?
        }
    };

    $scope.goToStaff = function(staff) {
        window.location.href = '../pages/staff_basic_info.html';
        sessionStorage.setItem('entityID', staff.id);
        let staff_name = staff.first_name + " " + staff.last_name;
        sessionStorage.setItem('entityName', staff_name)
        console.log("click " + sessionStorage.getItem('entityID'));
>>>>>>> 9368237f50adddc4b9ce82d46fd6a3a6b29642b0
    };

    return {
        set: set,
        get: get
    };
});

<<<<<<< HEAD
eventSpecific.controller('eventBasicInfo', ($scope, $location, $window, $http) => {
     var req = 'http://127.0.0.1:8081/events/' + sessionStorage.getItem('entityID');
     
     $http.get(req).then((res)=>{

        var basic_info = res.data.basic[0];
        
        $scope.name = basic_info.campaign_name;
        $scope.type = basic_info.campaign_type_name;
        $scope.theme = basic_info.theme;
        $scope.date = basic_info.campaign_date;

        sessionStorage.setItem('eventItem', JSON.stringify(res.data));
     });
});

eventSpecific.controller('eventAvailableItems', ($scope, $location, $window, $http) => {
    $scope.name = sessionStorage.getItem('entityName');
    $scope.items = [];
    
    var obj = JSON.parse(sessionStorage.getItem('eventItem'));
    obj.contributions.forEach(contribution => {
        var item = { item_name: contribution.item_name, item_type: contribution.contrib_type, amount: contribution.amount };
        $scope.items.push(item);
    });
});

eventSpecific.controller('eventAttendees', ($scope, $location, $window, $http) => {
    $scope.name = sessionStorage.getItem('entityName');
    $scope.attendees = [];

    var obj = JSON.parse(sessionStorage.getItem('eventItem'));

    obj.donors.forEach(donor => {
        var attendee = { attendee_name: donor.first_name + ' ' + donor.last_name, attendee_type: 'Donor'};
        $scope.attendees.push(attendee);
    });

    obj.staff.forEach(staff => {
        var attendee = { attendee_name: staff.first_name + ' ' + staff.last_name, attendee_type: 'Staff - ' + staff.staff_type };
        $scope.attendees.push(attendee);
    });
});
=======
entitySpecific.controller('entityData', function($scope) {
    let id = sessionStorage.getItem('entityID');
    let name = sessionStorage.getItem('entityName');
    $scope.entityID = id;
    $scope.entityName = name;
    console.log(id);
});

/* Graveyard of possibly usable codes:

// Separate controller for deleting an entity from a given data table
removeEntity.controller('removeEntityController', function($scope, $location, $window) {
    $scope.removeEntity = function(index){
        // Prompt user to confirm deletion; clicking OK returns true, Cancel returns false.
        let deleteEntity = $window.confirm("Are you sure you want to delete this entry?");

        // If user clicked OK, handle the deletion.
        if (deleteEntity){
            $scope.staff_members.splice(idx, 1);
        }
    };
});

*/
>>>>>>> 9368237f50adddc4b9ce82d46fd6a3a6b29642b0
