const app = angular.module('quizApp', ['ngRoute']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html?v=2',
            controller: 'HomeController'
        })
        .when('/login', {
            templateUrl: 'views/login.html?v=2',
            controller: 'LoginController'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html?v=2',
            controller: 'SignupController'
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html?v=2',
            controller: 'DashboardController'
        })
        .when('/create-quiz', {
            templateUrl: 'views/create-quiz.html?v=2',
            controller: 'CreateQuizController'
        })
        .when('/add-question/:quizId', {
            templateUrl: 'views/add-question.html?v=2',
            controller: 'AddQuestionController'
        })
        .when('/quiz-details/:quizCode', {
            templateUrl: 'views/quiz-details.html?v=2',
            controller: 'QuizDetailsController'
        })
        .when('/attempt-quiz/:quizCode', {
            templateUrl: 'views/attempt-quiz.html?v=2',
            controller: 'AttemptQuizController'
        })
        .when('/result', {
            templateUrl: 'views/result.html?v=2',
            controller: 'ResultController'
        })
        .when('/quiz-results/:quizId', {
            templateUrl: 'views/quiz-results.html?v=2',
            controller: 'ViewResultsController'
        })
        .when('/leaderboard/:quizId', {
            templateUrl: 'views/leaderboard.html?v=2',
            controller: 'LeaderboardController'
        })
        .when('/students', {
            templateUrl: 'views/students.html?v=2',
            controller: 'StudentsController'
        })
        .when('/classes', {
            templateUrl: 'views/classes.html?v=2',
            controller: 'ClassesController'
        })
        .when('/class-details/:id', {
            templateUrl: 'views/class-details.html?v=2',
            controller: 'ClassDetailsController'
        })
        .when('/profile', {
            templateUrl: 'views/profile.html?v=2',
            controller: 'ProfileController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

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
