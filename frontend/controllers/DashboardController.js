app.controller('DashboardController', ['$scope', 'QuizService', 'ResultService', 'UserService', '$location', '$rootScope', function($scope, QuizService, ResultService, UserService, $location, $rootScope) {
    $scope.quizzes = [];
    $scope.attempts = [];
    $scope.assignedQuizzes = [];
    $scope.analytics = { totalQuizzes: 0, averageScore: 0 };
    $scope.errorMessage = '';
    $scope.joinData = { quizCode: '' };
    $scope.shareUrl = '';
    $scope.copied = false;

    $scope.openShareModal = function(quizCode) {
        let baseUrl = window.location.origin + window.location.pathname;
        $scope.shareUrl = baseUrl + '#!/quiz-details/' + quizCode.toUpperCase();
        $scope.copied = false;
        
        var modalElement = document.getElementById('shareModal');
        if (modalElement) {
            var myModal = new bootstrap.Modal(modalElement);
            myModal.show();
        }
    };

    $scope.copyShareUrl = function() {
        var copyText = document.getElementById("shareUrlInput");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value).then(function() {
            $scope.$apply(function() {
                $scope.copied = true;
            });
            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.copied = false;
                });
            }, 2000);
        });
    };

    if (!$rootScope.isAuthenticated) {
        $location.path('/login');
        return;
    }

    if ($rootScope.user.role === 'teacher') {
        QuizService.getQuizzes().then(function(response) {
            $scope.quizzes = response.data;
        }).catch(function(error) {
            $scope.errorMessage = 'Failed to load quizzes';
        });
    }

    if ($rootScope.user.role === 'student') {
        ResultService.getMyAttempts().then(function(response) {
            $scope.attempts = response.data;
        }).catch(function(error) {
            // Attempt load error
        });
        
        QuizService.getAssignedQuizzes().then(function(response) {
            $scope.assignedQuizzes = response.data;
        }).catch(function(error) {
            console.error('Failed to load assigned quizzes', error);
        });

        UserService.getMyAnalytics().then(function(response) {
            $scope.analytics = response.data;
        }).catch(function(error) {
             console.error('Failed to load analytics', error);
        });
    }

    $scope.createQuiz = function() {
        $location.path('/create-quiz');
    };

    $scope.joinQuiz = function() {
        if (!$scope.joinData.quizCode) {
            $scope.errorMessage = 'Please enter a quiz code.';
            return;
        }

        $scope.errorMessage = '';
        $location.path('/quiz-details/' + $scope.joinData.quizCode.toUpperCase());
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
