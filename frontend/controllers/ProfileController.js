app.controller('ProfileController', ['$scope', 'UserService', '$rootScope', function($scope, UserService, $rootScope) {
    if (!$rootScope.isAuthenticated) {
        window.location.href = '#!/login';
        return;
    }

    $scope.profile = {};
    $scope.passwordData = {};
    $scope.successMessage = '';
    $scope.errorMessage = '';

    const loadProfile = function() {
        UserService.getProfile().then(function(response) {
            $scope.profile = response.data;
        }).catch(function(error) {
            $scope.errorMessage = 'Failed to load profile details.';
        });
    };

    $scope.changePassword = function() {
        $scope.errorMessage = '';
        $scope.successMessage = '';

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

        if (!passwordRegex.test($scope.passwordData.newPassword)) {
            $scope.errorMessage = 'Password must contain at least one capital letter, one symbol, and one digit.';
            return;
        }

        if ($scope.passwordData.newPassword !== $scope.passwordData.confirmPassword) {
            $scope.errorMessage = "New passwords do not match!";
            return;
        }

        UserService.changePassword({
            currentPassword: $scope.passwordData.currentPassword,
            newPassword: $scope.passwordData.newPassword
        }).then(function(response) {
            $scope.successMessage = response.data.message;
            $scope.passwordData = {};
        }).catch(function(error) {
            $scope.errorMessage = error.data.message || 'Failed to update password';
        });
    };

    loadProfile();
}]);
