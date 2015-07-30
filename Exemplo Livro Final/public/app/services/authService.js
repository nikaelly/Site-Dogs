/*
	O Serviço de autenticação é utilizado para garantir o acesso correto das funcionalidades do API, a partir do front-end.
	Para isso, ele precisa fazer 3 funções principais :
		- Funcoes de autenticacao : login, logoff, retornar o usuário logado e ver se o usuário está logado;
		- Funcoes de Token : gerar, receber e salvar o token;
		- Interceptador de requisicao : colocar o token nas requisicoes e redirecionar caso não tenha permissao;
	Como as 3 funções são bem distintas, serao criadas 3 factories
*/
angular.module('authService',[])
	
	// essa factory vai fazer as funcoes de autenticacao
	// o $http vai ser usado para comunicacao com a API
	// o $q vai ser usado para retornar promessas
	// o AuthToken vai ser usado para gerenciar os tokens 
	.factory('Auth', function($http, $q, AuthToken){
		var authFactory = {};

		// login
		authFactory.login = function(username,password){
			return $http.post('/api/authenticate', { username : username, password : password }) // manda um post pra API
							.success(function(data){ // quando retornar, se tiver sucesso ele guarda o token e retorna o resultado da requisicao
								AuthToken.setToken(data.token);
								return data
							});
		};


		// logout
		authFactory.logout = function() {
			AuthToken.setToken();
		};

		// checar se um usuario esta logado
		authFactory.isLoggedIn = function(){
			if (AuthToken.getToken()) return true;
			else return false;
		};

		// pegar a informacao do usuario
		authFactory.getUser = function(){
			if (AuthToken.getToken()) return $http.get('/api/me');
			else return $q.reject({ message: 'Este usuário não tem nenhum token válido.'}); // retorna uma promessa recusada (falha)
		};

		return authFactory;
	})

	// essa factory vai gerenciar os tokens
	// o $window vai ser usado para guardar o token do cliente (é salvo do lado do cliente para manter o paradigma Restful)
	.factory('AuthToken',function($window){
		var authTokenFactory = {};

		// pegar o token do local storage do navegador
		authTokenFactory.getToken = function(){
			return $window.localStorage.getItem('token');
		};

		// salvar ou limpar o token
		// se passar um token, guarda ele no local storage
		// senao, apaga ele de lá
		authTokenFactory.setToken = function(token){
			if(token) $window.localStorage.setItem('token',token);
			else $window.localStorage.removeItem('token');
		};

		return authTokenFactory;
	})

	// essa factory vai interceptar as requisições
	// o $location é utilizado para redirecionar sem mudar a página
	.factory('AuthInterceptor',function($q,$location, AuthToken){
		var interceptorFactory = {};

		// colocar o token nas requisições
		interceptorFactory.request = function(config) {
			var token = AuthToken.getToken();

			if (token) config.headers['x-access-token'] = token;

			return config;
		};

		// redirecionar se não tiver permissão
		// o response error é executado quando o backend retorna um erro
		interceptorFactory.responseError = function(response){
			if (response.status == 403){ // se ele nao conseguiu validar o token, entao ele limpa o token e manda para o login
				AuthToken.setToken();
				$location.path('/login');
			}
			return $q.reject(response);
		};

		return interceptorFactory;
	});
