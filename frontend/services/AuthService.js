app.factory('AuthService', ['$http', 'API_URL', '$rootScope', function($http, API_URL, $rootScope) {
    let currentUser = null;

    function setUserState(user) {
        currentUser = user;
        $rootScope.isAuthenticated = !!user;
        $rootScope.user = user;

        if (user) {
            sessionStorage.setItem('quizUser', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('quizUser');
        }
    }

    return {
        signup: function(user) {
            return $http.post(API_URL + '/auth/signup', user);
        },
        login: function(credentials) {
            return $http.post(API_URL + '/auth/login', credentials).then(function(response) {
                if (response.data.user) {
                    setUserState(response.data.user);
                }
                return response;
            });
        },
        logout: function() {
            return $http.get(API_URL + '/auth/logout').then(function(response) {
                setUserState(null);
                return response;
            });
        },
        checkAuth: function() {
            return $http.get(API_URL + '/auth/check-auth').then(function(response) {
                if (response.data.isAuthenticated) {
                    setUserState(response.data.user);
                } else {
                    setUserState(null);
                }
                return response.data;
            });
        },
        getCurrentUser: function() {
            return currentUser;
        }
    };
}]);
