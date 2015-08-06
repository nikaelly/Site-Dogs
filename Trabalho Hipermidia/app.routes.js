angular.module('app.routes',['ngRoute'])
	.config(function($routeProvider,$locationProvider){
		$routeProvider
			// rota para a home
			.when('/', {
				templateUrl  : '/home.html'
			});
	});