app.controller('QuizDetailsController', ['$scope', 'QuizService', '$routeParams', '$location', '$rootScope', function($scope, QuizService, $routeParams, $location, $rootScope) {
    if (!$rootScope.isAuthenticated || !$rootScope.user) {
        $location.path('/login');
        return;
    }

    $scope.quizCode = $routeParams.quizCode;
    $scope.quizInfo = null;
    $scope.canAttempt = false;
    $scope.reason = '';
    $scope.errorMessage = '';
    $scope.isLoading = true;

    // We need to add getEligibility to QuizService
    QuizService.getEligibility($scope.quizCode).then(function(response) {
        $scope.canAttempt = response.data.canAttempt;
        $scope.reason = response.data.reason;
        $scope.quizInfo = response.data.quizInfo;
        $scope.isLoading = false;
    }).catch(function(error) {
        $scope.errorMessage = 'Quiz not found or invalid code.';
        $scope.isLoading = false;
    });

    $scope.startAssessment = function() {
        if ($scope.canAttempt) {
            $location.path('/attempt-quiz/' + $scope.quizCode.toUpperCase());
        }
    };
}]);
