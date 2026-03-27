const app = angular.module('quizApp', ['ngRoute']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // Allows sending session cookies with requests (express-session)
    $httpProvider.defaults.withCredentials = true;

    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignupController'
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/create-quiz', {
            templateUrl: 'views/create-quiz.html',
            controller: 'CreateQuizController'
        })
        .when('/add-question/:quizId', {
            templateUrl: 'views/add-question.html',
            controller: 'AddQuestionController'
        })
        .when('/attempt-quiz/:quizId', {
            templateUrl: 'views/attempt-quiz.html',
            controller: 'AttemptQuizController'
        })
        .when('/result', {
            templateUrl: 'views/result.html',
            controller: 'ResultController'
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);

// Make API URL a constant
app.constant('API_URL', 'http://localhost:3000/api');
