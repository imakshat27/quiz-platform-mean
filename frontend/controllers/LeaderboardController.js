app.controller('LeaderboardController', ['$scope', '$routeParams', '$http', '$location', 'API_URL', function($scope, $routeParams, $http, $location, API_URL) {
    const quizId = $routeParams.quizId;
    $scope.loading = true;
    $scope.entries = [];
    $scope.quizTitle = '';

    $scope.goBack = function() {
        window.history.back();
    };

    $http.get(`${API_URL}/leaderboard/${quizId}`)
        .then(function(response) {
            $scope.quizTitle = response.data.quizTitle;
            $scope.entries = response.data.entries;
            $scope.loading = false;
        })
        .catch(function(error) {
            console.error('Error fetching leaderboard:', error);
            $scope.loading = false;
        });
}]);
