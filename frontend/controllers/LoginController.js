app.controller('LoginController', ['$scope', 'AuthService', '$location', '$rootScope', function ($scope, AuthService, $location, $rootScope) {
    $scope.credentials = { email: '', password: '' };
    $scope.errorMessage = '';

    $scope.login = function () {
        if ($scope.credentials.email) {
            $scope.credentials.email = $scope.credentials.email.toLowerCase();
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test($scope.credentials.email)) {
                $scope.errorMessage = 'Please enter a valid email address.';
                return;
            }
            if (!/[a-zA-Z]/.test($scope.credentials.email.split('@')[0])) {
                $scope.errorMessage = 'Email part before @ must contain at least one character.';
                return;
            }
        }

        AuthService.login($scope.credentials).then(function () {
            $location.path('/dashboard');
        }).catch(function (error) {
            $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Login failed';
        });
    };
}]);
