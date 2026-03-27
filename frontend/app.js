const app = angular.module('quizApp', ['ngRoute']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // Allows sending session cookies with requests (express-session)
    $httpProvider.defaults.withCredentials = true;

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
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
        .when('/attempt-quiz/:quizCode', {
            templateUrl: 'views/attempt-quiz.html',
            controller: 'AttemptQuizController'
        })
        .when('/result', {
            templateUrl: 'views/result.html',
            controller: 'ResultController'
        })
        .when('/quiz-results/:quizId', {
            templateUrl: 'views/quiz-results.html',
            controller: 'ViewResultsController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

// Make API URL a constant
app.constant('API_URL', 'http://localhost:3000/api');

app.run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
    const savedUser = sessionStorage.getItem('quizUser');

    if (savedUser) {
        $rootScope.user = JSON.parse(savedUser);
        $rootScope.isAuthenticated = true;
    } else {
        $rootScope.user = null;
        $rootScope.isAuthenticated = false;
    }

    AuthService.checkAuth().catch(angular.noop);
}]);
