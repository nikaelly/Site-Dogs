// injetando ngRoutes nas rotas

angular.module('routerRoutes',['ngRoute'])
	.config(function($routeProvider,$locationProvider){ // routeProvider é um serviço que gerencia as rotas
		$routeProvider
			.when('/', {   // método para definir uma rota
				templateUrl : 'views/pages/home.html', // indica qual html deve carregar
				controller : 'homeController',         // indica qual controller vai cuidar da pagina
				controllerAs : 'home'                  // cria um alias para o controller
			})
			.when('/about',{
				templateUrl : 'views/pages/about.html',
				controller : 'aboutController',
				controllerAs : 'about'
			})
			.when('/contact', {
				templateUrl : 'views/pages/contact.html',
				controller : 'contactController',
				controllerAs : 'contact'
			});

			// ativa o html5 para deixar a url bonitinha
			$locationProvider.html5Mode(true);
	})