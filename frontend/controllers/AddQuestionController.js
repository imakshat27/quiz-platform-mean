app.controller('AddQuestionController', ['$scope', 'QuizService', '$routeParams', '$location', '$rootScope', function($scope, QuizService, $routeParams, $location, $rootScope) {
    if (!$rootScope.isAuthenticated || $rootScope.user.role !== 'Admin') {
        $location.path('/dashboard');
        return;
    }

    $scope.quizId = $routeParams.quizId;
    $scope.question = { questionText: '', options: ['', '', '', ''], correctAnswer: null };
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.addedQuestions = [];

    function loadQuestions() {
        QuizService.getQuestionsByQuizId($scope.quizId).then(function(response) {
            $scope.addedQuestions = response.data;
        }).catch(function() {
            $scope.errorMessage = 'Could not load existing questions.';
        });
    }

    loadQuestions();

    $scope.addQuestion = function() {
        if ($scope.question.correctAnswer === null || $scope.question.correctAnswer === undefined) {
            $scope.errorMessage = "Please select a correct answer.";
            return;
        }

        if ($scope.question.options.some(function(opt) { return opt.trim() === ''; })) {
            $scope.errorMessage = "All options must be filled out.";
            return;
        }

        const newQuestion = {
            quizId: $scope.quizId,
            questionText: $scope.question.questionText,
            options: angular.copy($scope.question.options),
            correctAnswer: Number($scope.question.correctAnswer)
        };

        QuizService.addQuestion(newQuestion).then(function() {
            $scope.successMessage = "Question added successfully!";
            $scope.errorMessage = '';
            $scope.addedQuestions.push(newQuestion);
            $scope.question = { questionText: '', options: ['', '', '', ''], correctAnswer: null };

            setTimeout(function() {
                $scope.$apply(function() {
                    $scope.successMessage = '';
                });
            }, 3000);
        }).catch(function(error) {
            $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Failed to add question';
        });
    };

    $scope.finish = function() {
        $location.path('/dashboard');
    };
}]);
