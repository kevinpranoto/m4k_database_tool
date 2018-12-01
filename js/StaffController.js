var StaffController = angular.module('StaffController', []);
var entitySpecific = angular.module('entitySpecific', []);

StaffController.controller('staffEventsWorked', function($scope, $location, $window, $http) {
    var id = sessionStorage.getItem('entityID');
    var name = sessionStorage.getItem('entityName');

    $scope.entityName = name;
    $scope.events = [];

    var obj = JSON.parse(sessionStorage.getItem('staff_object'));
    console.log(obj);

    obj.events.forEach(event_attended => {
        var date = new Date(event.campaign_date);
        event.campaign_date = date.toDateString();
        $scope.events.push(event_attended);
    });
});

StaffController.controller('staffBasicInfo', function($scope, $location, $window, $http) {
    var id = sessionStorage.getItem('entityID');
    var name = sessionStorage.getItem('entityName');
    $scope.entityID = id;
    $scope.entityName = name;
    $scope.phones = [];
    $scope.emails = [];
    $scope.addresses = [];
    console.log(id);
    console.log(name);
    var getString = 'http://127.0.0.1:8081/staff/' + id;
    $http.get(getString).then((res)=>
    {
        var obj = res.data;
        console.log(obj);
        var basic_info = obj.basic[0];
        console.log(basic_info);
        $scope.fullName = basic_info.first_name + ' ' +
                          basic_info.last_name;
        $scope.staff_type = basic_info.staff_type;
        $scope.status = basic_info.staff_status;

        obj.phones.forEach(phone => {
            $scope.phones.push(phone);
        });

        obj.emails.forEach(email => {
            $scope.emails.push(email);
        });

        obj.addresses.forEach(address => {
            $scope.addresses.push(address);
        });

        sessionStorage.setItem('staff_object', JSON.stringify(obj));
    });
});

StaffController.controller('allStaff', function($scope, $location, $window, $http) {
    $scope.staff_members = []; 
    let staffID = {};

    function set(data) {
        staffID = data;
    };

    function get() {
        console.log("called");
        return staffID;
    };

    $http.get('http://127.0.0.1:8081/staff').then((res)=>
    {
        console.log(res.data);
        for (var i in res.data)
        {
            var obj = res.data[i];
            var staff = { id: obj.supporter_id, name: obj.first_name + ' ' + obj.last_name,  phone: obj.phone_number, email: obj.email_address, type: obj.staff_type, status: obj.staff_status};
            $scope.staff_members.push(staff);
        }
    });
    /* Function for providing the ability to highlight any given entry in a data table. */
    $scope.selectedRow = null;                          // Initialize selectedRow to null
    $scope.setClickedRow = function (index) {           // Set the value of the row to current index
        $scope.selectedRow = index;
        $scope.isDisabled = true;
    };

    /* Function to redirect the user from Staff View to data entry form for a new Staff object upon clicking
    *  the "Add Entry" button. */
    $scope.redirectToStaffForm = function(){
        $window.location.href = '../pages/staff_form.html';
    };

    $scope.removeRow = function(index){

        // Prompt user to confirm deletion; clicking OK returns true, Cancel returns false.
        let deleteRow = $window.confirm("Are you sure you want to delete this entry?");

        // If user clicked OK, handle the deletion.
        if (deleteRow) {
            staff_members.splice(index, 1);     // Just a placeholder, but will need code to update DB via Node.js?
        };
    };

    $scope.goToStaff = function(staff) {
        window.location.href = '../pages/staff_basic_info.html';
        sessionStorage.setItem('entityID', staff.id);
        let staff_name = staff.first_name + " " + staff.last_name;
        sessionStorage.setItem('entityName', staff.name);
        console.log("click " + sessionStorage.getItem('entityID'));
    };

    return {
        set: set,
        get: get
    };
});