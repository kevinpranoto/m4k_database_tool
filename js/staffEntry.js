var staffEntry = angular.module('staffEntry', []);
staffEntry.controller('staffForm', function($scope) {
    $scope.phoneTypes = [
        'Home', 'Work', 'Mobile'
    ];
    $scope.statuses = [
        'Staff', 'Volunteer',
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
    
	$scope.addEmail = function() {
        $scope.emails.push({address: ''});
	};

    $scope.submitStaff = function() {
        var name = $scope.salutation + " " + $scope.firstName + 
            " " + $scope.lastName + "\nAlso known as " + $scope.alias;
        console.log(name);
        console.log($scope.phones[0].number);
        var staff = {
            status: $scope.state,
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            emails: [],
            phones: [],
            addresses: [],
            notes: $scope.notes
        }
        $scope.phones.forEach(element => {
            staff.phones.push(element);
        });
        $scope.emails.forEach(element => {
            staff.emails.push(element);
        });
        $scope.addresses.forEach(element => {
            staff.addresses.push(element);
        });
        console.log(JSON.stringify(staff));
        //send donor here to server
    };	
});