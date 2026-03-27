app.factory('AuthService', ['$http', 'API_URL', '$rootScope', function($http, API_URL, $rootScope) {
    let currentUser = null;

    return {
        signup: function(user) {
            return $http.post(API_URL + '/auth/signup', user);
        },
        login: function(credentials) {
            return $http.post(API_URL + '/auth/login', credentials).then(function(response) {
                if (response.data.user) {
                    currentUser = response.data.user;
                    $rootScope.isAuthenticated = true;
                    $rootScope.user = currentUser;
                }
                return response;
            });
        },
        logout: function() {
            return $http.get(API_URL + '/auth/logout').then(function(response) {
                currentUser = null;
                $rootScope.isAuthenticated = false;
                $rootScope.user = null;
                return response;
            });
        },
        checkAuth: function() {
            return $http.get(API_URL + '/auth/check-auth').then(function(response) {
                if (response.data.isAuthenticated) {
                    currentUser = response.data.user;
                    $rootScope.isAuthenticated = true;
                    $rootScope.user = currentUser;
                } else {
                    currentUser = null;
                    $rootScope.isAuthenticated = false;
                    $rootScope.user = null;
                }
                return response.data;
            });
        },
        getCurrentUser: function() {
            return currentUser;
        }
    };
}]);
