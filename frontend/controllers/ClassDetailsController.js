app.controller('ClassDetailsController', ['$scope', 'ClassService', '$routeParams', '$location', '$rootScope', function($scope, ClassService, $routeParams, $location, $rootScope) {
    if (!$rootScope.isAuthenticated || $rootScope.user.role !== 'teacher') {
        $location.path('/dashboard');
        return;
    }

    $scope.classDetails = null;
    $scope.errorMessage = '';
    const classId = $routeParams.id;

    ClassService.getClassDetails(classId).then(function(response) {
        $scope.classDetails = response.data;
    }).catch(function(error) {
        $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Error fetching class details.';
    });

    $scope.removeStudent = function(studentId, studentName) {
        if (confirm("Are you sure you want to remove " + studentName + " from this class?")) {
            ClassService.removeStudent(classId, studentId).then(function(response) {
                // Filter the student array safely without full reload
                $scope.classDetails.students = $scope.classDetails.students.filter(function(s) {
                    return s._id !== studentId;
                });
            }).catch(function(error) {
                $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Failed to remove student.';
            });
        }
    };
}]);
