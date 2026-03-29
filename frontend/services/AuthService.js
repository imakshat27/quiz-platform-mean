app.factory('AuthService', ['$q', 'API_URL', '$rootScope', function($q, API_URL, $rootScope) {
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

    function ajaxRequest(method, url, data) {
        var deferred = $q.defer();
        $.ajax({
            url: url,
            type: method,
            data: data ? JSON.stringify(data) : undefined,
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function(res) {
                $rootScope.$apply(function() {
                    deferred.resolve({ data: res });
                });
            },
            error: function(err) {
                $rootScope.$apply(function() {
                    deferred.reject({ data: err.responseJSON, status: err.status });
                });
            }
        });
        return deferred.promise;
    }

    return {
        signup: function(user) {
            return ajaxRequest('POST', API_URL + '/auth/signup', user);
        },
        login: function(credentials) {
            return ajaxRequest('POST', API_URL + '/auth/login', credentials).then(function(response) {
                if (response.data.user) {
                    setUserState(response.data.user);
                }
                return response;
            });
        },
        logout: function() {
            return ajaxRequest('GET', API_URL + '/auth/logout').then(function(response) {
                setUserState(null);
                return response;
            });
        },
        checkAuth: function() {
            return ajaxRequest('GET', API_URL + '/auth/check-auth').then(function(response) {
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
