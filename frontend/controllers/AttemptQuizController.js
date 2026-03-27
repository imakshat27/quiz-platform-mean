app.controller('AttemptQuizController', ['$scope', 'QuizService', 'ResultService', '$routeParams', '$location', '$rootScope', function($scope, QuizService, ResultService, $routeParams, $location, $rootScope) {
    if (!$rootScope.isAuthenticated) {
        $location.path('/login');
        return;
    }

    $scope.quizId = $routeParams.quizId;
    $scope.quiz = null;
    $scope.questions = [];
    $scope.userAnswers = [];
    $scope.errorMessage = '';

    QuizService.getQuizById($scope.quizId).then(function(response) {
        $scope.quiz = response.data;
    });

    QuizService.getQuestionsByQuizId($scope.quizId).then(function(response) {
        $scope.questions = response.data;
        $scope.userAnswers = new Array($scope.questions.length).fill(null);
    }).catch(function(error) {
        $scope.errorMessage = 'Could not load quiz questions.';
    });

    $scope.submitQuiz = function() {
        if ($scope.userAnswers.includes(null)) {
            if (!confirm('You have unanswered questions. Are you sure you want to submit?')) {
                return;
            }
        }

        const submission = {
            quizId: $scope.quizId,
            answers: $scope.userAnswers
        };

        ResultService.submitQuiz(submission).then(function(response) {
            $location.path('/result');
        }).catch(function(error) {
            $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Failed to submit quiz';
        });
    };
}]);
