app.controller('SignupController', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
    $scope.user = { name: '', email: '', password: '' };
    $scope.errorMessage = '';
    $scope.successMessage = '';

    $scope.signup = function() {
        // jQuery and Regex validation
        const email = $('#email').val();
        const password = $('#password').val();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Password must contain at least one capital letter, one symbol, and one digit
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

        if (!emailRegex.test(email)) {
            $scope.errorMessage = 'Please enter a valid email address.';
            return;
        }

        if (!passwordRegex.test(password)) {
            $scope.errorMessage = 'Password must contain at least one capital letter, one symbol, and one digit.';
            return;
        }

        $scope.errorMessage = '';

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
