angular.module('mainController',[])
	.controller('mainController', function($rootScope, $location, Auth){
		var vm = this;
		vm.loggedIn = Auth.isLoggedIn();
		// o rootscope é usado para detectar alterações na rota
		// quando acontecer uma troca de rota (requisicao para outra pagina) verifica se tem um usuário logado
		$rootScope.$on('$routeChangeStart',function(){
			// pegar a pessoa que está logada
			vm.loggedIn = Auth.isLoggedIn();

			Auth.getUser().then(function(data){  // nao da pra usar success aqui porque quando falha, retorna uma promessa rejeitada
					vm.user = data.data;				 // entao tem que ter algum tratamento pra quando isso acontece
				}, function(response){			 // no caso isso é feito no function(response)

				});

		});

		// gerenciar o form de login
		vm.doLogin = function() {
			vm.processing = true; //variavel para mostrar q ta fazendo alguma coisa
			Auth.login(vm.loginData.username, vm.loginData.password)
				.success(function(data){
					vm.processing = false;
					if (data.success) $location.path('/users'); //se conseguiu logar, manda pra página de usuários
					else vm.error = data.message;
				});
		};

		// gerenciar o logout
		vm.doLogout = function() {
			Auth.logout();
			vm.user = {}; // limpa os dados do usuario logado
			$location.path('/login'); // redireciona para a página de login
		};
		

	});