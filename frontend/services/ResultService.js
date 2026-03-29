app.factory('ResultService', ['$q', '$rootScope', 'API_URL', function($q, $rootScope, API_URL) {
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
        submitQuiz: function(submission) {
            return ajaxRequest('POST', API_URL + '/result/submit-quiz', submission);
        },
        getQuizResults: function(quizId) {
            return ajaxRequest('GET', API_URL + '/result/quiz/' + quizId + '/results');
        }
    };
}]);
