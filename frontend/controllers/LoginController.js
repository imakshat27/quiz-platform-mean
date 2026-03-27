app.controller('LoginController', ['$scope', 'AuthService', '$location', '$rootScope', function ($scope, AuthService, $location, $rootScope) {
    $scope.credentials = { email: '', password: '' };
    $scope.errorMessage = '';

    $scope.login = function () {
        AuthService.login($scope.credentials).then(function () {
            $location.path('/dashboard');
        }).catch(function (error) {
            $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Login failed';
        });
    };
}]);
