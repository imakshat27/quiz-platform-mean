app.controller('CreateQuizController', ['$scope', 'QuizService', '$location', '$rootScope', function($scope, QuizService, $location, $rootScope) {
    if (!$rootScope.isAuthenticated) {
        $location.path('/login');
        return;
    }

    $scope.quiz = { title: '', description: '', testType: 'instant', durationMinutes: null, scheduledFor: null };
    $scope.errorMessage = '';

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
