app.controller('ClassesController', ['$scope', 'ClassService', '$location', '$rootScope', function($scope, ClassService, $location, $rootScope) {
    if (!$rootScope.isAuthenticated) {
        window.location.href = '#!/login';
        return;
    }

    $scope.classes = [];
    $scope.newClassData = {};
    $scope.joinData = {};
    $scope.successMessage = '';
    $scope.errorMessage = '';

    const loadClasses = function() {
        if ($rootScope.user.role === 'teacher') {
            ClassService.getTeacherClasses().then(function(response) {
                $scope.classes = response.data;
            }).catch(function(error) {
                $scope.errorMessage = 'Failed to load classes';
            });
        } else {
            ClassService.getStudentClasses().then(function(response) {
                $scope.classes = response.data;
            }).catch(function(error) {
                $scope.errorMessage = 'Failed to load classes';
            });
        }
    };

    $scope.createClass = function() {
        $scope.errorMessage = '';
        $scope.successMessage = '';
        ClassService.createClass($scope.newClassData).then(function(response) {
            $scope.successMessage = 'Class created successfully! Code: ' + response.data.class.classCode;
            $scope.newClassData = {};
            loadClasses();
        }).catch(function(error) {
            $scope.errorMessage = error.data.message || 'Failed to create class';
        });
    };

    $scope.joinClass = function() {
        $scope.errorMessage = '';
        $scope.successMessage = '';
        ClassService.joinClass($scope.joinData).then(function(response) {
            $scope.successMessage = 'Successfully joined ' + response.data.class.name;
            $scope.joinData = {};
            loadClasses();
        }).catch(function(error) {
            $scope.errorMessage = error.data.message || 'Failed to join class';
        });
    };

    $scope.viewClassDetails = function(classId) {
        $location.path('/class-details/' + classId);
    };

    $scope.leaveClass = function(classId, className) {
        if (confirm("Are you sure you want to leave " + className + "?")) {
            ClassService.removeStudent(classId, $rootScope.user.id).then(function(response) {
                $scope.successMessage = "Successfully left " + className;
                loadClasses();
            }).catch(function(error) {
                $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Failed to leave class';
            });
        }
    };

    loadClasses();
}]);
