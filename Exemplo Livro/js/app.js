angular.module('appTeste',[])
	.controller('mainController', function(){

		// instancia o controlador
		var vm = this;

		vm.message = 'Bem vindo ao appTeste.';

		vm.computers = [
		{ name: 'Macbook Pro', color: 'Silver', nerdness: 7 },
		{ name: 'Yoga 2 Pro', color: 'Gray', nerdness: 6 },
		{ name: 'Chromebook', color: 'Black', nerdness: 5 }
		];


		vm.computerData = {};
		vm.addComputer = function() {
		// add a computer to the list
		vm.computers.push({
			name: vm.computerData.name,
			color: vm.computerData.color,
			nerdness: vm.computerData.nerdness
			});
		// after our computer has been added, clear the form
		vm.computerData = {};
		};

		
	});