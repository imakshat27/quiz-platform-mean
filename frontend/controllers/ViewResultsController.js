app.controller('ViewResultsController', ['$scope', '$routeParams', 'QuizService', 'ResultService', '$location', '$rootScope', function($scope, $routeParams, QuizService, ResultService, $location, $rootScope) {
    if (!$rootScope.isAuthenticated) {
        $location.path('/login');
        return;
    }

    $scope.quizId = $routeParams.quizId;
    $scope.quiz = null;
    $scope.results = [];
    $scope.errorMessage = '';

    // Fetch quiz info
    QuizService.getQuizById($scope.quizId).then(function(response) {
        $scope.quiz = response.data;
        // Fetch results
        ResultService.getQuizResults($scope.quizId).then(function(res) {
            $scope.results = res.data;
        }).catch(function(err) {
            $scope.errorMessage = 'Failed to load results.';
        });
    }).catch(function(error) {
        $scope.errorMessage = 'Failed to load quiz details.';
    });

    $scope.goBack = function() {
        $location.path('/dashboard');
    };
}]);
