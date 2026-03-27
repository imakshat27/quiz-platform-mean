app.controller('HomeController', ['$location', '$rootScope', function ($location, $rootScope) {
    if ($rootScope.isAuthenticated) {
        $location.path('/dashboard');
        return;
    }

    $location.path('/login');
}]);
