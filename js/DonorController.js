var donorSpecific = angular.module('donorSpecific', []);
var allDonors = angular.module('allDonors', []);

allDonors.controller('donorsTable', function($scope, $location, $window, $http) {
    
    $scope.donors = [];
    
    var donorID = {};

    console.log('test');
    $http.get('http://127.0.0.1:8081/donors').then((res)=>
    {
        console.log(res.data);
        for (var i in res.data)
        {
            var obj = res.data[i];
            var donor = { id: obj.supporter_id, name: obj.first_name + ' ' + obj.last_name, company: obj.company_name, last_contribution_date: 'N/A', phone: obj.phone_number, email: obj.email_address, type: obj.donor_type, status: obj.donor_status};
            $scope.donors.push(donor);
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
    
    $scope.goToDonor = function(donor) {
        window.location.href = '../pages/donor_basic_info.html';
        sessionStorage.setItem('entityID', donor.id);
        sessionStorage.setItem('entityName', donor.name)
        console.log("click " + sessionStorage.getItem('entityID'));

        $http.get('http://127.0.0.1:8081/donors/' + sessionStorage.getItem('entityID')).then((res) =>
        {
            console.log(res.data);
        });
    };

    $scope.removeEntries = function() {
        var something_deleted = false;
        $scope.donors.forEach(don => {
            if (don.to_remove == true) {
                var deletePrompt = $window.confirm("Delete " + don.name + "? (Deletion cannot be reverted)");
                if (deletePrompt) {
                    something_deleted = true;
                    console.log(don.id);
                    $http.delete('http://127.0.0.1:8081/donors/' + don.id);
                };
            };
        });
        if (something_deleted) {
            window.location.href = '../pages/all_donors.html';
        };
    };

    $scope.addNewDonor = function() {
        sessionStorage.setItem('isModify', false);
        window.location.href = '../pages/donor_form.html';
    };
});

donorSpecific.controller('donorEventsAttendedTable', function($scope, $location, $window, $http) {
    var id = sessionStorage.getItem('entityID');
    var name = sessionStorage.getItem('entityName');

    $scope.entityName = name;
    $scope.event_items = [];

    var obj = JSON.parse(sessionStorage.getItem('donor_object'));
});

donorSpecific.controller('donorEventsAttendedTable', function($scope, $location, $window, $http) {
    var id = sessionStorage.getItem('entityID');
    var name = sessionStorage.getItem('entityName');

    $scope.entityName = name;
    $scope.events = [];

    var obj = JSON.parse(sessionStorage.getItem('donor_object'));
    console.log(obj);

    obj.events.forEach(event_info => {
        var date = new Date(event_info.campaign_date);
        event_info.campaign_date = date.toDateString();
        $scope.events.push(event_info);
    });
});

donorSpecific.controller('donorContributionsTable', function($scope, $location, $window, $http) {
    var id = sessionStorage.getItem('entityID');
    var name = sessionStorage.getItem('entityName');

    $scope.entityName = name;
    $scope.contributions = [];

    var obj = JSON.parse(sessionStorage.getItem('donor_object'));
    console.log(obj);

    obj.contributions.forEach(contribution => {
        var date = new Date(contribution.contrib_date);
        contribution.contrib_date= date.toDateString();
        $scope.contributions.push(contribution);
    });

    $scope.redirectToContributionForm = function() {
        window.location.href = '../pages/contribution_form.html';
    };
});

donorSpecific.controller('donorPledgesTable', function($scope, $location, $window, $http) {
    var id = sessionStorage.getItem('entityID');
    var name = sessionStorage.getItem('entityName');

    $scope.entityName = name;
    $scope.pledges = [];

    var obj = JSON.parse(sessionStorage.getItem('donor_object'));
    console.log(obj);

    obj.pledges.forEach(pledge => {
        var date = new Date(pledge.pledge_date);
        pledge.pledge_date = date.toDateString();
        pledge.target_amount = (pledge.target_amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');  // 12,345.67
        $scope.pledges.push(pledge);
    });
});

donorSpecific.controller('donorBasicInfo', function($scope, $location, $window, $http) {
    var id = sessionStorage.getItem('entityID');
    var name = sessionStorage.getItem('entityName');
    $scope.entityID = id;
    $scope.entityName = name;
    $scope.phones = [];
    $scope.emails = [];
    $scope.addresses = [];
    console.log(id);
    var getString = 'http://127.0.0.1:8081/donors/' + id;
    $http.get(getString).then((res)=>
    {
        var obj = res.data;
        console.log(obj);
        var basic_info = obj.basic[0];
        console.log(basic_info)
        $scope.fullName = basic_info.salutation + ' ' +
                           basic_info.first_name + ' ' +
                           basic_info.last_name;
        $scope.hide_alias = false;
        if ($scope.alias == null) 
        {
            $scope.hide_alias = true;
        }
        $scope.alias = basic_info.alias;
        $scope.donor_type = basic_info.donor_type;
        $scope.hide_company = true;
        if ($scope.donor_type === "Company")
        {
            $scope.hide_company = false;
            $scope.company_name = obj.companies[0].company_name;
        }
        $scope.status = basic_info.donor_status;

        obj.phones.forEach(phone => {
            $scope.phones.push(phone);
        });

        obj.emails.forEach(email => {
            $scope.emails.push(email);
        });

        obj.addresses.forEach(address => {
            $scope.addresses.push(address);
        });

        sessionStorage.setItem('donor_object', JSON.stringify(obj));
    });

    $scope.editingDonor = function() { 
        sessionStorage.setItem('isModify', true);
        sessionStorage.setItem('entityID', id);
        console.log("button clicked");
        window.location.href = '../pages/donor_form.html';
    };

});

var donorEntry = angular.module('donorEntry', []);
donorEntry.directive('phoneInput', function($filter, $browser) {
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
donorEntry.filter('tel', function () {
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
donorEntry.controller('donorForm', function($scope, $http) {
    $scope.myMod = {isModify: 'true'};
    $scope.myMod.isModify = sessionStorage.getItem('isModify');

    $scope.salutations = [
        'Mr.', 'Ms.', 'Mrs.', 'Dr.', 
        'Prof.', 'Rev.', 'Lady', 'Sir', 'President'
    ];
     $scope.phoneTypes = [
        'business', 'home', 'mobile'
    ];
     $scope.statuses = [
        'Active', 'Lax', 'Lost'
    ];
     $scope.addressTypes = [
        'home', 'business'
    ];
    $scope.types = [
        'Individual', 'Company', 'Household'
    ];
    
    $scope.emails = [
        {email_address: '', is_primary: 1}
    ];
    
    $scope.phones = [
        {phone_type: '', phone_number: '', is_primary: 1}
    ];

    $scope.addresses = [
        {address_type: '', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', is_primary: 1}
    ];

    $scope.companies = [];

	$scope.addPhone = function() {
        $scope.phones.push({phone_type: '', phone_number: '', is_primary: 1});
	};
    
	$scope.addAddress = function() {
        $scope.addresses.push({address_type: '', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', is_primary: 1});
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
    $scope.primaryAddress = function(address) {
        $scope.addresses.forEach(element => {
            if (element == address) {
                element.is_primary = 1;
            }
            else {
                element.is_primary = 0;
            }
        });
    };


    if ($scope.myMod.isModify === 'true'){
        var modId = sessionStorage.getItem('entityID');
        console.log(modId);
        var getStr = 'http://127.0.0.1:8081/donors/' + modId;
        $http.get(getStr).then((res)=>
        {
            var obj = res.data;
            console.log("now modifying");
            console.log(obj);
            var basic_info = obj.basic[0];

            $scope.state = basic_info.donor_status;
            $scope.type = basic_info.donor_type;
            $scope.salutation = basic_info.salutation; 
            $scope.firstName = basic_info.first_name;
            $scope.lastName = basic_info.last_name;
            $scope.alias = basic_info.alias;
            $scope.company = obj.companies[0].company_name;

            $scope.phones = [];
            obj.phones.forEach(phone => {
                $scope.phones.push(phone);
            });

            $scope.emails = [];
            obj.emails.forEach(email => {
                $scope.emails.push(email);
            });

            $scope.addresses = [];
            obj.addresses.forEach(address => {
                $scope.addresses.push(address);
            });

            sessionStorage.setItem('donor_object', JSON.stringify(obj));
        });        
    }
        

    $scope.submitDonor = function() {

        if ($scope.myMod.isModify === 'true') {
            var donor = {
                donor_status: $scope.state,
                donor_type: $scope.type,
                salutation: $scope.salutation, 
                first_name: $scope.firstName,
                last_name: $scope.lastName,
                alias: $scope.alias,
                emails: [],
                phones: [], 
                addresses: [],
                companies: [
                    {company_name: $scope.company, is_primary: 1}
                ]
            };
            $scope.phones.forEach(element => {
                donor.phones.push(element);
            });
            
            $scope.emails.forEach(element => {
                donor.emails.push(element);
            });

            $scope.addresses.forEach(element => {
                donor.addresses.push(element);
            });
            if (donor.phones.length == 0) {
                donor.phones.push({phone_number: '', phone_type: '', is_primary: 1});
            }
            if (donor.emails.length == 0) {
                donor.emails.push({email_address: '', is_primary: 1});
            }
            if (donor.addresses.length == 0) {
                donor.address.push({address_type: '', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', is_primary: 1});
            }

            var putStr = getStr;
            $http.put(putStr, donor).then((res) => {
                console.log(res);
                window.location.href = '../pages/donor_basic_info.html';
            });
        }
        else {
            var name = $scope.salutation + " " + $scope.firstName + 
                " " + $scope.lastName + "\nAlso known as " + $scope.alias;
            console.log(name);
            var donor = {
                donor_status: $scope.state,
                donor_type: $scope.type,
                salutation: $scope.salutation, 
                first_name: $scope.firstName,
                last_name: $scope.lastName,
                alias: $scope.alias,
                emails: [],
                phones: [], 
                addresses: [],
                companies: [
                    {company_name: $scope.company, is_primary: 'true'}
                ]
            }
            $scope.phones.forEach(element => {
                donor.phones.push(element);
            });
            
            $scope.emails.forEach(element => {
                donor.emails.push(element);
            });

            $scope.addresses.forEach(element => {
                donor.addresses.push(element);
            });

            if (donor.phones.length == 0) {
                donor.phones.push({phone_number: '', phone_type: '', is_primary: 1});
            }
            if (donor.emails.length == 0) {
                donor.emails.push({email_address: '', is_primary: 1});
            }
            if (donor.addresses.length == 0) {
                donor.addresses.push({address_type: '', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', is_primary: 1});
            }
            
            console.log(JSON.stringify(donor));
            $http.post('http://127.0.0.1:8081/donors', donor).then((res) => {
                console.log(res);
                window.location.href = '../pages/all_donors.html';
            });
            //send donor here to server
        }
    };	
});