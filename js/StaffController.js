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
        var date = new Date(event_attended.campaign_date);
        event_attended.campaign_date = date.toDateString();
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

    $scope.editingStaff = function() {
        sessionStorage.setItem('isModify', true);
        sessionStorage.setItem('entityID', id);
        console.log("button clicked");
        window.location.href = '../pages/staff_form.html';
    };
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
        sessionStorage.setItem('isModify', false);
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

    $scope.removeEntries = function() {
        var something_deleted = false;
        $scope.staff_members.forEach(staff => {
            if (staff.to_remove == true) {
                var deletePrompt = $window.confirm("Delete " + staff.name + "? (Deletion cannot be reverted)");
                if (deletePrompt) {
                    something_deleted = true;
                    console.log(staff.id);
                    $http.delete('http://127.0.0.1:8081/staff/' + staff.id);
                };
            };
        });
        if (something_deleted) {
            window.location.href = '../pages/all_staff.html';
        };
    };

    return {
        set: set,
        get: get
    };
});

var staffEntry = angular.module('staffEntry', []);
staffEntry.directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
});
staffEntry.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 3) + '-' + number.slice(3,7);
            }
            else{
                number = number;
            }
            tel = city + "-" + number;
            console.log(tel);
            return ("" + city + "-" + number).trim();
        }
        else{
            tel = city;
            console.log(tel);
            return "" + city;
        }

    };
});
staffEntry.controller('staffForm', function($scope, $http) {

    $scope.myMod = {isModify: 'true'};
    $scope.myMod.isModify = sessionStorage.getItem('isModify');

    $scope.phoneTypes = [
        'home', 'business', 'mobile'
    ];
    $scope.types = [
        'Employee', 'Volunteer',
    ];
    $scope.statuses = [
        'Active', 'Inactive'
    ];

    $scope.emails = [
        {email_address: '', is_primary: 1}
    ];
    
    $scope.phones = [
        {phone_type: '', phone_number: '', is_primary: 1}
    ];

    $scope.addresses = [
        {address_type: 'home', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', is_primary: 1}
    ];

	$scope.addPhone = function() {
        $scope.phones.push({phone_type: '', phone_number: '', is_primary: 1});
	};
    
	$scope.addEmail = function() {
        $scope.emails.push({email_address: '', is_primary: 1});
    };

    $scope.primaryPhone = function(phone) {
        $scope.phones.forEach(element => {
            if (element == phone) {
                element.is_primary = 1;
            }
            else {
                element.is_primary = 0;
            }
        });
    };
    $scope.primaryEmail = function(email) {
        $scope.emails.forEach(element => {
            if (element == email) {
                element.is_primary = 1;
            }
            else {
                element.is_primary = 0;
            }
        });
    };

    if ($scope.myMod.isModify == 'true') {
        var modId = sessionStorage.getItem('entityID');
        console.log(modId);
        var getStr = 'http://127.0.0.1:8081/staff/' + modId;
        $http.get(getStr).then((res)=> {
            var obj = res.data;
            var basic_info = obj.basic[0];
            console.log(obj);
            console.log("now modifying");
            $scope.state = basic_info.staff_status;
            $scope.type = basic_info.staff_type;
            $scope.firstName = basic_info.first_name;
            $scope.lastName = basic_info.last_name;

            $scope.emails = obj.emails;
            $scope.phones = [];
            obj.phones.forEach(phone => {
                $scope.phones.push(phone);
            });
            $scope.addresses = obj.addresses;
        });
    }
    $scope.submitStaff = function() {

        if ($scope.myMod.isModify === 'true') {
            var staff= {
                staff_status: $scope.state,
                staff_type: $scope.type,
                salutation: $scope.salutation, 
                first_name: $scope.firstName,
                last_name: $scope.lastName,
                alias: $scope.alias,
                emails: $scope.emails,
                phones: [], 
                addresses: $scope.addresses
            };
            var putStr = getStr;
            $scope.phones.forEach(element => {
                var str = element.phone_number;
                staff.phones.push(JSON.parse(JSON.stringify(element)));
                if (str.length == 10) {
                    staff.phones[staff.phones.length - 1].phone_number = JSON.parse(JSON.stringify(str.substr(0, 3) + '-' + str.substr(3, 3) + '-' + str.substr(6)));
                }
            });
            if (staff.phones.length == 0) {
                staff.phones.push({phone_number: '', phone_type: '', is_primary: 1});
            }
            if (staff.emails.length == 0) {
                staff.emails.push({email_address: '', is_primary: 1});
            }
            if (staff.addresses.length == 0) {
                staff.address.push({address_type: '', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', is_primary: 1});
            }
            $http.put(putStr, staff).then((res) => {
                console.log(res);
                window.location.href = '../pages/staff_basic_info.html';
            });
        }
        else {
            var name = $scope.salutation + " " + $scope.firstName + 
                " " + $scope.lastName + "\nAlso known as " + $scope.alias;
            console.log(name);
            var staff = {
                staff_status: $scope.state,
                staff_type: $scope.type,
                first_name: $scope.firstName,
                last_name: $scope.lastName,
                salutation: '',
                alias: '',
                emails: [],
                phones: [],
                addresses: [],
            }
            $scope.emails.forEach(element => {
                staff.emails.push(element);
            });
            $scope.phones.forEach(element => {
                var str = element.phone_number;
                staff.phones.push(JSON.parse(JSON.stringify(element)));
                if (str.length == 10) {
                    staff.phones[staff.phones.length - 1].phone_number = JSON.parse(JSON.stringify(str.substr(0, 3) + '-' + str.substr(3, 3) + '-' + str.substr(6)));
                }
            });
            $scope.addresses.forEach(element => {
                staff.addresses.push(element);
            });
            if (staff.phones.length == 0) {
                staff.phones.push({phone_number: '', phone_type: '', is_primary: 1});
            }
            if (staff.emails.length == 0) {
                staff.emails.push({email_address: '', is_primary: 1});
            }
            if (staff.addresses.length == 0) {
                staff.address.push({address_type: '', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', is_primary: 1});
            }
            console.log(JSON.stringify(staff));
            //send donor here to server
            $http.post('http://127.0.0.1:8081/staff', staff).then((res) => {
                console.log(res);
                window.location.href = '../pages/all_staff.html';
            });
        }

    };	
});