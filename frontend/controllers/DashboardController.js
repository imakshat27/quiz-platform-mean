app.controller('DashboardController', ['$scope', 'QuizService', 'ResultService', '$location', '$rootScope', function($scope, QuizService, ResultService, $location, $rootScope) {
    $scope.quizzes = [];
    $scope.attempts = [];
    $scope.errorMessage = '';
    $scope.joinData = { quizCode: '' };

    if (!$rootScope.isAuthenticated) {
        $location.path('/login');
        return;
    }

    QuizService.getQuizzes().then(function(response) {
        $scope.quizzes = response.data;
    }).catch(function(error) {
        $scope.errorMessage = 'Failed to load quizzes';
    });

    ResultService.getMyAttempts().then(function(response) {
        $scope.attempts = response.data;
    }).catch(function(error) {
        // Attempt load error
    });

    $scope.createQuiz = function() {
        $location.path('/create-quiz');
    };

    $scope.joinQuiz = function() {
        if (!$scope.joinData.quizCode) {
            $scope.errorMessage = 'Please enter a quiz code.';
            return;
        }

        $scope.errorMessage = '';
        $location.path('/attempt-quiz/' + $scope.joinData.quizCode.toUpperCase());
    };

    $scope.addQuestions = function(quizId) {
        $location.path('/add-question/' + quizId);
    };

    $scope.viewQuizResults = function(quizId) {
        $location.path('/quiz-results/' + quizId);
    };

    $scope.viewLeaderboard = function(quizId) {
        $location.path('/leaderboard/' + quizId);
    };

    $scope.deleteQuiz = function(quizId) {
        if (confirm('Are you sure you want to delete this quiz?')) {
            QuizService.deleteQuiz(quizId).then(function() {
                $scope.quizzes = $scope.quizzes.filter(function(q) { return q._id !== quizId; });
            }).catch(function(error) {
                console.error('Error deleting quiz', error);
                alert('Could not delete quiz');
            });
        }
    };

    $scope.deleteAttempt = function(attemptId) {
        if (confirm('Are you sure you want to remove this attempt from your dashboard?')) {
            ResultService.hideAttempt(attemptId).then(function() {
                $scope.attempts = $scope.attempts.filter(function(a) { return a._id !== attemptId; });
            }).catch(function(error) {
                console.error('Error removing attempt', error);
                alert('Could not remove attempt');
            });
        }
    };
}]);
