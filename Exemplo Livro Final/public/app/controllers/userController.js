// A diferença entre Service e Controller é o fato de que o service que vai coletar os dados,
// enquanto o controller vai arrumar para que a view possa pegá-los

// definindo o módulo e injetando o serviço
angular.module('userController',['userService'])
	.controller('userController',function(User){
		var vm = this;


		vm.processing = true; // mostrar o bagulho rodandinho

		// como o http e o JavaScript é assincrono, é necessário garantir que certas coisas aconteçam na ordem
		// requisições http retornam promessas, que basicamente sao listeners para quando o servidor retornar a requisição
		// no success, o bloco é executado caso a requisicao volte com status 200 OK
		// no error, o bloco é executado caso a requisicao volte com erro
		// no then, o bloco é executado quando a requisicao volta, idependente do estado.
		User.all().then(function(data){
			vm.processing = false;
			vm.users = data.data; // ele pega todos os usuarios do API, dai quando ele voltar, ele associa esses usuarios com um objeto
							// que pode ser acessado pela view
		}, function(response){

		} );

		vm.deleteUser = function(id){
			vm.processing = true;

			User.delete(id).then(function(data){
				User.all().then(function(data){
					vm.processing = false;
					vm.users = data.data;
				}, function(response){

				} );
			});
		};

	})
	// controller especial para criar usuários
	.controller('userCreateController', function(User){
		var vm = this;

		// para diferenciar elementos da tela de edição da de inserção
		vm.type = 'create';

		vm.saveUser = function() {
			vm.processing = true;

			// limpa a mensagem
			vm.message = '';

			User.create(vm.userData).success(function(data){
				vm.processing = false;
				// limpa o form
				vm.userData = {};
				vm.message = data.message;
			});
		};
	})
	.controller('userEditController', function($routeParams,User){
		var vm = this;

		vm.type = 'edit';
		vm.id = $routeParams.user_id
		User.get(vm.id).success(function(data){
			vm.userData = data;
		});

		vm.saveUser = function() {

			vm.processing = true;
			vm.message = '';

			User.update(vm.id, vm.userData).success(function(data){
				vm.processing = false;
				vm.userData = {};
				vm.message =data.message;
			});
		};
	});