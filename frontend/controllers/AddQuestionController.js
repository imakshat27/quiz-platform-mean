app.controller('AddQuestionController', ['$scope', 'QuizService', '$routeParams', '$location', '$rootScope', function($scope, QuizService, $routeParams, $location, $rootScope) {
    if (!$rootScope.isAuthenticated) {
        $location.path('/login');
        return;
    }

    $scope.quizId = $routeParams.quizId;
    $scope.question = { questionText: '', options: ['', '', '', ''], correctAnswer: null };
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.addedQuestions = [];
    $scope.isEditing = false;
    $scope.editingQuestionId = null;

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

        const questionData = {
            quizId: $scope.quizId,
            questionText: $scope.question.questionText,
            options: angular.copy($scope.question.options),
            correctAnswer: Number($scope.question.correctAnswer)
        };

        if ($scope.isEditing) {
            QuizService.updateQuestion($scope.editingQuestionId, questionData).then(function() {
                $scope.successMessage = "Question updated successfully!";
                $scope.errorMessage = '';
                $scope.cancelEdit();
                loadQuestions();
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.successMessage = '';
                    });
                }, 3000);
            }).catch(function(error) {
                $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Failed to update question';
            });
        } else {
            QuizService.addQuestion(questionData).then(function() {
                $scope.successMessage = "Question added successfully!";
                $scope.errorMessage = '';
                $scope.question = { questionText: '', options: ['', '', '', ''], correctAnswer: null };
                loadQuestions();
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.successMessage = '';
                    });
                }, 3000);
            }).catch(function(error) {
                $scope.errorMessage = error.data && error.data.message ? error.data.message : 'Failed to add question';
            });
        }
    };

    $scope.startEdit = function(q) {
        $scope.isEditing = true;
        $scope.editingQuestionId = q._id;
        $scope.question = {
            questionText: q.questionText,
            options: angular.copy(q.options),
            correctAnswer: q.correctAnswer
        };
        window.scrollTo(0, 0);
    };

    $scope.cancelEdit = function() {
        $scope.isEditing = false;
        $scope.editingQuestionId = null;
        $scope.question = { questionText: '', options: ['', '', '', ''], correctAnswer: null };
        $scope.errorMessage = '';
    };

    $scope.deleteQuestion = function(q) {
        if (confirm('Are you sure you want to delete this question?')) {
            QuizService.deleteQuestion(q._id).then(function() {
                loadQuestions();
            }).catch(function() {
                alert('Failed to delete question.');
            });
        }
    };

    $scope.finish = function() {
        $location.path('/dashboard');
    };
}]);
