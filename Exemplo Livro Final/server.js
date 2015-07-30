// Dando os imports

var express = require('express'), // framework do node
	app = express(),			  // facilitar a chamada
    bodyParser = require('body-parser'), // poder usar o body das requisições POST
	morgan = require('morgan'),    // mandar as requests pro console
	mongoose = require('mongoose'), // conexao com o banco
	config = require('./config.js'), // importa as configurações do arquivo config.js
	path = require('path'); // pra chamar arquivos usando o caminho 

// =================================================================
// Configurações base 

// Isso faz com que ele interprete o body das requisições HTTP POST
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())

// Isso faz com que ele gerencie requisicoes CORS (cross origin requisitions)
app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
	next();
});

// Isso faz com que as requisições recebidas vão para o console
app.use(morgan('dev'));

// Conexão com o banco : 
mongoose.connect(config.database)

// setar localizacao estatica dos arquivos
// usado para resolver requisições do frontend
app.use(express.static(__dirname+'/public'));

// ======================================================================
// Configurações de Rota

var apiRoutes = require('./app/routes/api')(app,express); //importa o apiRoutes

// pendura o apiRouter em localhost:porta/api
app.use('/api', apiRoutes);

// Se não entrar em nenhuma rota do apiRoutes, vem pra cá
app.get ('*', function (req, res){
	res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});


// ===================================================================
// Poe o server pra rodar
app.listen(config.port);
console.log('Roles acontecem na porta '+config.port+'.');