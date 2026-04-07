app.controller('DashboardController', ['$scope', 'QuizService', '$location', '$rootScope', function($scope, QuizService, $location, $rootScope) {
    $scope.quizzes = [];
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
}]);
