app.factory('ResultService', ['$http', 'API_URL', function($http, API_URL) {
    return {
        submitQuiz: function(submission) {
            return $http.post(API_URL + '/result/submit-quiz', submission);
        },
        getMyResults: function() {
            return $http.get(API_URL + '/result/my-results');
        }
    };
}]);
