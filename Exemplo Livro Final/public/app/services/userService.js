angular.module('userService',[])
	// injetando o módulo http para fazer funções para a API
	// factorys sao servicos que criam objetos, adicionam propriedades ao objeto criado e retorna ele
	.factory('User',function($http){
		// cira um factory novo
		var userFactory = {};

		// endereço do API
		var url = 'http://localhost:8080';

		// retorna o usuário cujo id é igual o parametro
		userFactory.get = function(id) {
			return $http.get(url + '/api/users/' + id);
		};

		// retorna todos os usuários
		userFactory.all = function() {
			return $http.get(url + '/api/users/')
		};

		// cria um usuário novo
		userFactory.create = function(userData){
			return $http.post(url + '/api/users/',userData);
		};

		// atualiza um usuário
		userFactory.update = function(id,userData){
			return $http.put(url + '/api/users/'+id, userData);
		};

		// deleta um usuário
		userFactory.delete = function(id){
			return $http.delete(url + '/api/users/'+ id);
		};
		return userFactory;
	});