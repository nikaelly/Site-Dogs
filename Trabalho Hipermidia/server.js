// imports

var express = require('express'),
	app = express(),
	path = require('path'); // para usar arquivos em outras pastas
// ====================================================================
// rotas

// linkar a pasta public
app.use(express.static(__dirname));

app.get('*', function(req,res){
	res.sendFile(path.join(__dirname + 'index.html'));
});

// ====================================================================
// rodando o server

app.listen(8080);
console.log('Roles acontecem na porta 8080.');
