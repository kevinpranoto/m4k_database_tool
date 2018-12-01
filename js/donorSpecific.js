var donorSpecific = angular.module('donorSpecific', []);

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