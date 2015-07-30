angular.module('userApp',[	'ngAnimate', // adiciona animações de css pra ficar bonitinho
							'app.routes', // rotas do front-end
							'authService', // serviço de autenticação
							'mainController', // controller principal
							'userController', //controller para gerenciar os usuários
							'userService' // serviço para gerenciar os usuários
							])
	
	// para configurar os interceptadores
	.config(function($httpProvider){
		$httpProvider.interceptors.push('AuthInterceptor');
	});