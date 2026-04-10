app.controller('CreateQuizController', ['$scope', 'QuizService', 'ClassService', '$location', '$rootScope', function($scope, QuizService, ClassService, $location, $rootScope) {
    if (!$rootScope.isAuthenticated) {
        $location.path('/login');
        return;
    }

    $scope.quiz = { title: '', description: '', classId: '', testType: 'instant', durationMinutes: null, scheduledFor: null, scheduledEndTime: null };
    $scope.classes = [];
    $scope.errorMessage = '';

    ClassService.getTeacherClasses().then(function(res) {
        $scope.classes = res.data;
    }).catch(function(err) {
        console.error("Could not fetch classes", err);
    });

    $scope.create = function() {
        QuizService.createQuiz($scope.quiz).then(function(response) {
            const createdQuizId = response.data.quiz ? response.data.quiz._id : response.data.quizId || response.data._id;
            
            if (createdQuizId) {
                $location.path('/add-question/' + createdQuizId);
            } else {
                $location.path('/dashboard');
            }
        }).catch(function(error) {
            $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Failed to create quiz';
        });
    };
}]);
