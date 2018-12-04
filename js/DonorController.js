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
    /*
    return {
        set: set,
        get: get
    };*/
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
});

var donorEntry = angular.module('donorEntry', []);
donorEntry.controller('donorForm', function($scope) {
    $scope.salutations = [
        'Mr.', 'Ms.', 'Mrs.', 'Dr.', 
        'Prof.', 'Rev.', 'Lady', 'Sir'
    ];
     $scope.phoneTypes = [
        'Home', 'Work', 'Mobile'
    ];
     $scope.statuses = [
        'Active', 'Lax', 'Lost'
    ];
     $scope.addressTypes = [
        'Residential', 'Business'
    ];
    
    $scope.emails = [
        {email_address: '', is_primary: ''}
    ];
    
    $scope.phones = [
        {phone_type: '', phone_number: '', is_primary: ''}
    ];

    $scope.addresses = [
        {address_type: '', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', is_primary: ''}
    ];

    $scope.companies = [
        {company_name: '', is_primary: ''}
    ];

	$scope.addPhone = function() {
        $scope.phones.push({phone_type: '', phone_number: '', is_primary: ''});
	};
    
	$scope.addAddress = function() {
        $scope.addresses.push({address_type: '', address_line_1: '', address_line_2: '', city: '', state: '', zip_code: '', is_primary: ''});
	};
    
	$scope.addEmail = function() {
        $scope.emails.push({email_address: '', is_primary: ''});
    };

    $scope.submitDonor = function() {
        var name = $scope.salutation + " " + $scope.firstName + 
            " " + $scope.lastName + "\nAlso known as " + $scope.alias;
        console.log(name);
        console.log($scope.phones[0].number);
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
            notes: $scope.notes
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
        console.log(JSON.stringify(donor));
        //send donor here to server
    };	
});