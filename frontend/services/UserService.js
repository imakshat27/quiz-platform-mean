app.factory('UserService', ['$http', 'API_URL', function($http, API_URL) {
    return {
        getTeachers: function() {
            return $http.get(API_URL + '/user/teachers');
        },
        getMyStudents: function() {
            return $http.get(API_URL + '/user/my-students', { withCredentials: true });
        },
        getStudentAnalytics: function(studentId) {
            return $http.get(API_URL + '/user/student/' + studentId + '/analytics', { withCredentials: true });
        },
        getMyAnalytics: function() {
            return $http.get(API_URL + '/user/my-analytics', { withCredentials: true });
        }
    };
}]);
