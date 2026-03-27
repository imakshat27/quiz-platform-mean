app.controller('AttemptQuizController', ['$scope', 'QuizService', 'ResultService', '$routeParams', '$location', '$rootScope', function($scope, QuizService, ResultService, $routeParams, $location, $rootScope) {
    if (!$rootScope.isAuthenticated || !$rootScope.user) {
        $location.path('/login');
        return;
    }

    $scope.quizCode = $routeParams.quizCode;
    $scope.quiz = null;
    $scope.questions = [];
    $scope.userAnswers = [];
    $scope.errorMessage = '';
    $scope.participantName = $rootScope.user.name;

    QuizService.getQuizByCode($scope.quizCode).then(function(response) {
        $scope.quiz = response.data;
        
        QuizService.getQuestionsByQuizId($scope.quiz._id).then(function(qResponse) {
            $scope.questions = qResponse.data;
            $scope.userAnswers = new Array($scope.questions.length).fill(null);
        }).catch(function() {
            $scope.errorMessage = 'Could not load quiz questions.';
        });
    }).catch(function(error) {
        $scope.errorMessage = 'Invalid Quiz Code or Quiz not found.';
    });

    $scope.submitQuiz = function() {
        if ($scope.userAnswers.includes(null)) {
            if (!confirm('You have unanswered questions. Are you sure you want to submit?')) {
                return;
            }
        }

        const submission = {
            quizId: $scope.quiz._id,
            answers: $scope.userAnswers
        };

        ResultService.submitQuiz(submission).then(function(response) {
            $rootScope.latestResult = response.data.result;
            $location.path('/result');
        }).catch(function(error) {
            $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Failed to submit quiz';
        });
    };
}]);
