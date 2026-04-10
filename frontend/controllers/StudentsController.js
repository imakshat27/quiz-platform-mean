app.controller('StudentsController', ['$scope', 'UserService', 'ClassService', '$location', '$rootScope', function($scope, UserService, ClassService, $location, $rootScope) {
    $scope.students = [];
    $scope.classes = [];
    $scope.classFilter = { className: '' };
    $scope.errorMessage = '';
    $scope.selectedStudent = null;
    $scope.studentAnalytics = null;

    if (!$rootScope.isAuthenticated || $rootScope.user.role !== 'teacher') {
        $location.path('/dashboard');
        return;
    }

    UserService.getMyStudents().then(function(response) {
        $scope.students = response.data;
    }).catch(function(error) {
        $scope.errorMessage = 'Failed to load students.';
    });

    ClassService.getTeacherClasses().then(function(res) {
        $scope.classes = res.data;
    }).catch(angular.noop);

    $scope.viewStudentDetails = function(studentId) {
        UserService.getStudentAnalytics(studentId).then(function(response) {
            $scope.selectedStudent = response.data.student;
            $scope.studentAnalytics = response.data.analytics;
            
            var modalElement = document.getElementById('studentDetailsModal');
            if (modalElement) {
                var myModal = new bootstrap.Modal(modalElement);
                myModal.show();
            }
        }).catch(function(error) {
            alert('Failed to load student details.');
        });
    };
}]);
