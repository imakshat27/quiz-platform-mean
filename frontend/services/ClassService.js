app.service('ClassService', ['$http', 'API_URL', function($http, API_URL) {
    this.createClass = function(classData) {
        return $http.post(API_URL + '/class/create', classData);
    };

    this.joinClass = function(joinData) {
        return $http.post(API_URL + '/class/join', joinData);
    };

    this.getTeacherClasses = function() {
        return $http.get(API_URL + '/class/teacher');
    };

    this.getStudentClasses = function() {
        return $http.get(API_URL + '/class/student');
    };

    this.getClassDetails = function(classId) {
        return $http.get(API_URL + '/class/' + classId + '/details');
    };

    this.removeStudent = function(classId, studentId) {
        return $http.post(API_URL + '/class/' + classId + '/remove-student', { studentId: studentId });
    };
}]);
