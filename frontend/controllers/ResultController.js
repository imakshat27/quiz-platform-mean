app.controller('ResultController', ['$scope', 'ResultService', '$location', '$rootScope', function($scope, ResultService, $location, $rootScope) {
    if (!$rootScope.isAuthenticated) {
        $location.path('/login');
        return;
    }

    $scope.results = [];
    $scope.errorMessage = '';

    ResultService.getMyResults().then(function(response) {
        $scope.results = response.data;
    }).catch(function(error) {
        $scope.errorMessage = 'Failed to load results';
    });

    $scope.goBack = function() {
        $location.path('/dashboard');
    };
}]);
