app.controller('ResultController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
    if (!$rootScope.latestResult) {
        $location.path('/dashboard');
        return;
    }

    $scope.result = $rootScope.latestResult;

    $scope.goHome = function() {
        $rootScope.latestResult = null; // Clear it when going home
        $location.path('/dashboard');
    };
}]);
