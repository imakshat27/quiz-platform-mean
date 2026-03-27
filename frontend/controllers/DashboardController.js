app.controller('DashboardController', ['$scope', 'QuizService', '$location', '$rootScope', function($scope, QuizService, $location, $rootScope) {
    $scope.quizzes = [];
    $scope.errorMessage = '';

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

    $scope.addQuestions = function(quizId) {
        $location.path('/add-question/' + quizId);
    };

    $scope.attemptQuiz = function(quizId) {
        $location.path('/attempt-quiz/' + quizId);
    };
    
    $scope.viewResults = function() {
        $location.path('/result');
    };
}]);
