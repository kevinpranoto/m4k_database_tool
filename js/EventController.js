var allEvents = angular.module('allEvents', []);
var eventSpecific = angular.module('eventSpecific', []);

allEvents.controller('EventController', function($scope, $location, $window, $http) {

    $scope.events = [];

    $http.get('http://127.0.0.1:8081/events').then((res) =>
    {
        console.log(res.data);
        for (var i in res.data)
        {
            var obj = res.data[i];
            var dt = new Date(obj.campaign_date);
            var event = { id: obj.campaign_id, name: obj.campaign_name, date: dt.toDateString(), theme: obj.theme}
            $scope.events.push(event);
        }
    });

    let eventID = {};

    function set(data) {
        eventID = data;
    }

    function get() {
        console.log("called");
        return eventID;
    }

    /* Function for providing the ability to highlight any given entry in a data table. */
    $scope.selectedRow = null;                          // Initialize selectedRow to null
    $scope.setClickedRow = function (index) {           // Set the value of the row to current index
        $scope.selectedRow = index;
        $scope.isDisabled = true;
    };

    /* Function to redirect the user from Staff View to data entry form for a new Staff object upon clicking
    *  the "Add Entry" button. */
    $scope.redirectToEventForm = function(){
        $window.location.href = '../pages/event_form.html';
    };

    $scope.goToEvent = function(event) {
        $window.location.href = '../pages/event_basic_info.html';
        sessionStorage.setItem('entityID', event.id);
        sessionStorage.setItem('entityName', event.name);
    };

    $scope.removeEntries = function() {
        var something_deleted = false;
        $scope.events.forEach(ev => {
            if (ev.to_remove == true) {
                var deletePrompt = $window.confirm("Delete " + ev.name + "? (Deletion cannot be reverted)");
                if (deletePrompt) {
                    something_deleted = true;
                    console.log('http://127.0.0.1:8081/campaigns/' + ev.id);
                    $http.delete('http://127.0.0.1:8081/campaigns/' + ev.id);
                };
            };
        });
        if (something_deleted) {
            window.location.href = '../pages/all_events.html';
        };
    };

    $scope.addNewEvent = function() {
        sessionStorage.setItem('isModify', false);
        window.location.href = '../pages/event_form.html';
    };

    return {
        set: set,
        get: get
    };
});

eventSpecific.controller('eventBasicInfo', ($scope, $location, $window, $http) => {
     var id = sessionStorage.getItem('entityID');
     var req = 'http://127.0.0.1:8081/events/' + sessionStorage.getItem('entityID');
     
     $http.get(req).then((res)=>{

        var basic_info = res.data.basic[0];
        
        $scope.name = basic_info.campaign_name;
        $scope.type = basic_info.campaign_type_name;
        $scope.theme = basic_info.theme;
        var dt = new Date(basic_info.campaign_date);
        $scope.date = dt.toDateString();

        sessionStorage.setItem('eventItem', JSON.stringify(res.data));
     });

     $scope.editingEvent = function() { 
        sessionStorage.setItem('isModify', true);
        sessionStorage.setItem('entityID', id);
        window.location.href = '../pages/event_form.html';
    };
});

eventSpecific.controller('eventAvailableItems', ($scope, $location, $window, $http) => {
    $scope.name = sessionStorage.getItem('entityName');
    $scope.items = [];
    
    var obj = JSON.parse(sessionStorage.getItem('eventItem'));
    obj.contributions.forEach(contribution => {
        var item = { item_name: contribution.item_name, item_type: contribution.contrib_type, amount: contribution.amount };
        $scope.items.push(item);
    });
    $scope.redirectToEventItemsForm = function() {
        sessionStorage.setItem('entityID', obj.basic[0].campaign_id);
        $window.loaction.href = "../pages/event_available_items_form.html";
    };
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

    $scope.redirectToAttendeeForm = function() {
        sessionStorage.setItem('entityID', obj.basic[0].campaign_id);
        $window.location.href = "../pages/event_attendance_form.html";
    };
});

var eventEntry = angular.module('eventEntry', []);
eventEntry.controller('eventForm', function($scope, $http) {
    $scope.myMod = {isModify: 'true'};
    $scope.myMod.isModify = sessionStorage.getItem('isModify');

    $http.get('http://127.0.0.1:8081/campaigntype').then((res)=>{
        $scope.campaigns = res.data;
    });

    if ($scope.myMod.isModify === 'true'){
        var modId = sessionStorage.getItem('entityID');
        var getStr = 'http://127.0.0.1:8081/events/' + modId;
        $http.get(getStr).then((res)=>
        {
            var obj = res.data.basic[0];
            console.log(obj);
            $scope.name = obj.campaign_name;
            $scope.date = new Date(obj.campaign_date);
            $scope.theme = obj.theme;
            $scope.campaign_type_id = obj.campaign_type_id;

            sessionStorage.setItem('event_object', JSON.stringify(obj));
        });
    } 

    $scope.submitEvent = function() {

        if ($scope.myMod.isModify === 'true') {
            var event = {
                campaign_name: $scope.name,
                campaign_date: $scope.date,
                theme: $scope.theme,
                is_event: 1,
                campaign_type_id: 1,
                donors: [],
                staff: [],
                contributions: []
            };
            
            var putStr = 'http://127.0.0.1:8081/campaigns/' + modId;
            $http.put(putStr, event).then((res) => {
                window.location.href = '../pages/event_basic_info.html';
            });
        }
        else {
            var event = {
                campaign_name: $scope.name,
                campaign_date: $scope.date,
                theme: $scope.theme,
                is_event: 1,
                campaign_type_id: 1,
                donors: [],
                staff: [],
                contributions: []
            };

            JSON.stringify(event);
            $http.post('http://127.0.0.1:8081/campaigns', event).then((res) => {
                window.location.href = '../pages/all_events.html';
            });
            //send event here to server

            $http.post('http://127.0.0.1:8081/donors', donor).then((res) => {
                console.log(res);
                window.location.href = '../pages/all_donors.html';
            });
        }
    };	
});
