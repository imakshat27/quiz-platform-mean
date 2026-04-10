app.controller('AttemptQuizController', ['$scope', 'QuizService', 'ResultService', '$routeParams', '$location', '$rootScope', '$interval', function($scope, QuizService, ResultService, $routeParams, $location, $rootScope, $interval) {
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
    
    $scope.remainingTime = null;
    $scope.timerDisplay = '';
    let timerInterval = null;

    QuizService.getEligibility($scope.quizCode).then(function(response) {
        if (!response.data.canAttempt) {
            $location.path('/quiz-details/' + $scope.quizCode);
            return;
        }

        $scope.quiz = response.data.quizInfo;
        
        QuizService.getQuestionsByQuizId($scope.quiz._id).then(function(qResponse) {
            $scope.questions = qResponse.data;
            $scope.userAnswers = new Array($scope.questions.length).fill(null);
            
            if ($scope.quiz.durationMinutes && $scope.quiz.durationMinutes > 0) {
                $scope.remainingTime = $scope.quiz.durationMinutes * 60;
                updateTimerDisplay();
                
                timerInterval = $interval(function() {
                    $scope.remainingTime--;
                    updateTimerDisplay();
                    
                    if ($scope.remainingTime <= 0) {
                        $interval.cancel(timerInterval);
                        alert("Time's up! Submitting automatically.");
                        $scope.submitQuiz(true);
                    }
                }, 1000);
            }
        }).catch(function() {
            $scope.errorMessage = 'Could not load quiz questions.';
        });
    }).catch(function(error) {
        $scope.errorMessage = 'Invalid Quiz Code or Quiz not found.';
    });

    function updateTimerDisplay() {
        if ($scope.remainingTime === null) {
            $scope.timerDisplay = '';
            return;
        }
        let minutes = Math.floor($scope.remainingTime / 60);
        let seconds = $scope.remainingTime % 60;
        $scope.timerDisplay = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    $scope.submitQuiz = function(force = false) {
        if (!force && $scope.userAnswers.includes(null)) {
            if (!confirm('You have unanswered questions. Are you sure you want to submit?')) {
                return;
            }
        }
        
        if (timerInterval) $interval.cancel(timerInterval);

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

    $scope.$on('$destroy', function() {
        if (timerInterval) $interval.cancel(timerInterval);
    });
}]);
