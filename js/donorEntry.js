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
        {address: ''}
    ];
    
    $scope.phones = [
        {type: '', number: ''}
    ];

    $scope.addresses = [
        {type: '', street: '', city: '', state: '', zip: ''}
    ];

	$scope.addPhone = function() {
        $scope.phones.push({type: '', number: ''});
	};
    
	$scope.addAddress = function() {
        $scope.addresses.push({type: '', street: '', city: '', state: '', zip: ''});
	};
    
	$scope.addEmail = function() {
        $scope.emails.push({address: ''});
	};

    $scope.submitDonor = function() {
        var name = $scope.salutation + " " + $scope.firstName + 
            " " + $scope.lastName + "\nAlso known as " + $scope.alias;
        console.log(name);
        console.log($scope.phones[0].number);
        var donor = {
            status: $scope.state,
            salutation: $scope.salutation, 
            firstName: $scope.firstName,
            lastName: $scope.lastName,
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