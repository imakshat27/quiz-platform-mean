app.controller('LoginController', ['$scope', 'AuthService', '$location', '$rootScope', function ($scope, AuthService, $location, $rootScope) {
    $scope.credentials = { email: '', password: '' };
    $scope.errorMessage = '';

    $scope.login = function () {
        // Explicitly using JQuery, AJAX and JSON to satisfy project constraints
        //AJAX Using Jquery
        $.ajax({
            url: 'http://localhost:3000/api/auth/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify($scope.credentials),
            xhrFields: {
                withCredentials: true // Extremely important for Express Sessions/Cookies!
            },
            success: function (response) {
                // Must use $scope.$apply since JQuery runs outside of Angular's digest cycle
                $scope.$apply(function () {
                    if (response.user) {
                        $rootScope.isAuthenticated = true;
                        $rootScope.user = response.user;
                        $location.path('/dashboard');
                    }
                });
            },
            error: function (xhr) {
                $scope.$apply(function () {
                    const errorResponse = xhr.responseJSON;
                    $scope.errorMessage = errorResponse && errorResponse.message ? errorResponse.message : 'Login failed';
                });
            }
        });
    };
}]);
