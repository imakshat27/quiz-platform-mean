app.controller('CreateQuizController', ['$scope', 'QuizService', '$location', '$rootScope', function($scope, QuizService, $location, $rootScope) {
    if (!$rootScope.isAuthenticated || $rootScope.user.role !== 'Admin') {
        $location.path('/dashboard');
        return;
    }

    $scope.quiz = { title: '', description: '' };
    $scope.errorMessage = '';

    $scope.create = function() {
        QuizService.createQuiz($scope.quiz).then(function(response) {
            // response.data.quiz might have the _id
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
