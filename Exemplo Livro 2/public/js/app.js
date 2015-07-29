
// recomendado sempre instanciar o controlador quando cria ele
// usando var vm = this

// injeta (importa) o módulo routerRoutes definido no app.routes.js
angular.module('routerApp',['routerRoutes'])
	.controller('mainController',function(){ // controller para a tela inicial
		var vm = this;

		vm.bigmessage = 'A vingança nunca é plena, mata a alma e envenena.';
	})
	.controller('homeController',function(){ // controller para a home
		var vm = this;

		vm.message = 'Esta é a home.';
	})
	.controller('aboutController',function(){ // controller para o about
		var vm = this;

		vm.message = 'Este é o about.';
	})
	.controller('contactController',function(){ // controller para o contact
		var vm = this;

		vm.message = 'Este é o contato.';
	})