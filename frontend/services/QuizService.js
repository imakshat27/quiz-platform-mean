app.factory('QuizService', ['$q', '$rootScope', 'API_URL', function($q, $rootScope, API_URL) {
    function ajaxRequest(method, url, data) {
        var deferred = $q.defer();
        $.ajax({
            url: url,
            type: method,
            data: data ? JSON.stringify(data) : undefined,
            contentType: 'application/json',
            xhrFields: { withCredentials: true },
            success: function(res) {
                $rootScope.$apply(function() {
                    deferred.resolve({ data: res });
                });
            },
            error: function(err) {
                $rootScope.$apply(function() {
                    deferred.reject({ data: err.responseJSON, status: err.status });
                });
            }
        });
        return deferred.promise;
    }

    return {
        createQuiz: function(quiz) {
            return ajaxRequest('POST', API_URL + '/quiz/create-quiz', quiz);
        },
        getQuizzes: function() {
            return ajaxRequest('GET', API_URL + '/quiz/my-quizzes');
        },
        getQuizById: function(id) {
            return ajaxRequest('GET', API_URL + '/quiz/quiz/' + id);
        },
        getQuizByCode: function(code) {
            return ajaxRequest('GET', API_URL + '/quiz/code/' + code);
        },
        addQuestion: function(question) {
            return ajaxRequest('POST', API_URL + '/question/add-question', question);
        },
        getQuestionsByQuizId: function(quizId) {
            return ajaxRequest('GET', API_URL + '/question/questions/' + quizId);
        }
    };
}]);
