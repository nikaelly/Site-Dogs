// este módulo vai definir as rotas do front-end

angular.module('app.routes',['ngRoute'])
	.config(function($routeProvider,$locationProvider){
		$routeProvider
			// rota para a home
			.when('/', {
				templateUrl  : 'app/views/pages/home.html'
			})
			// rota para a tela de login
			.when('/login',{
				templateUrl : 'app/views/pages/login.html',
				controller : 'mainController',
				controllerAs : 'login'
			})
			// rota para a tela de usuários
			.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
			})
			// rota para criar usuários
			.when('/users/create', {
				templateUrl: 'app/views/pages/users/single.html',
				controller: 'userCreateController',
				controllerAs: 'user'
			})
			// rota para editar ususrios
			.when('/users/:user_id', {
				templateUrl: 'app/views/pages/users/single.html',
				controller: 'userEditController',
				controllerAs: 'user'
			});
		$locationProvider.html5Mode(true);
	});