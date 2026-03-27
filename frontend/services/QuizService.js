app.factory('QuizService', ['$http', 'API_URL', function($http, API_URL) {
    return {
        createQuiz: function(quiz) {
            return $http.post(API_URL + '/quiz/create-quiz', quiz);
        },
        getQuizzes: function() {
            return $http.get(API_URL + '/quiz/my-quizzes');
        },
        getQuizById: function(id) {
            return $http.get(API_URL + '/quiz/quiz/' + id);
        },
        getQuizByCode: function(code) {
            return $http.get(API_URL + '/quiz/code/' + code);
        },
        addQuestion: function(question) {
            return $http.post(API_URL + '/question/add-question', question);
        },
        getQuestionsByQuizId: function(quizId) {
            return $http.get(API_URL + '/question/questions/' + quizId);
        }
    };
}]);
