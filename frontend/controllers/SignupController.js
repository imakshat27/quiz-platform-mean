app.controller('SignupController', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
    $scope.user = { name: '', email: '', password: '', role: 'Student' };
    $scope.errorMessage = '';
    $scope.successMessage = '';

    $scope.signup = function() {
        AuthService.signup($scope.user).then(function(response) {
            $scope.successMessage = 'Signup successful! Redirecting to login...';
            setTimeout(function() {
                $scope.$apply(function() {
                    $location.path('/login');
                });
            }, 1500);
        }).catch(function(error) {
            $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Signup failed';
        });
    };
}]);
