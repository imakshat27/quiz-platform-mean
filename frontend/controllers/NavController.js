app.controller('NavController', ['$scope', 'AuthService', '$location', '$rootScope', function($scope, AuthService, $location, $rootScope) {
    AuthService.checkAuth().catch(angular.noop);

    $scope.logout = function() {
        AuthService.logout().then(function() {
            $location.path('/login');
        });
    };
}]);
