app.controller('SignupController', ['$scope', 'AuthService', 'UserService', '$location', function($scope, AuthService, UserService, $location) {
    $scope.user = { name: '', email: '', password: '', role: 'student', teacherId: '' };
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.teachers = [];

    UserService.getTeachers().then(function(response) {
        $scope.teachers = response.data;
    }).catch(function(error) {
        console.error('Error fetching teachers', error);
    });

    $scope.signup = function() {
        const name = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
        const nameRegex = /^[a-zA-Z\s]+$/;

        if (!nameRegex.test(name)) {
            $scope.errorMessage = 'Full Name must only contain characters and spaces.';
            return;
        }

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
