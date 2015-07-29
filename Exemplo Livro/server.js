// Dando os imports

var express = require('express'), // framework do node
	app = express(),			  // facilitar a chamada
    bodyParser = require('body-parser'), // poder usar o body das requisições POST
	morgan = require('morgan'),    // mandar as requests pro console
	mongoose = require('mongoose'), // conexao com o banco
	port = process.env.Port || 8080, // setando a porta
	User = require('./app/models/user'), // chama a classe user
	jwt = require('jsonwebtoken'), // módulo para gerar os tokens de autenticação
	superSecret = 'baconbaconbacon'; //segredo para ser usado na geração dos tokens

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
mongoose.connect('mongodb://localhost:27017/testelivro')


// ======================================================================
// Configurações de Rota

// O primeiro parametro do app/apiRouter.get é o endereço da rota a ser tratada e o segundo é uma função do que fazer
// quando acontecer um get naquele endereço

// essa pagina ta no localhost:port/
app.get ('/', function (req, res){
	res.send('Bem vido ao Início.')
})

// O apiRouter vai servir como um conjunto de rotas
var apiRouter = express.Router();


// gerar o token antes da autenticação do middleware
// link para a geração : localhost:porta/api/authenticate
apiRouter.post('/authenticate',function(req,res,next){
	User.findOne({ username : req.body.username})
				.select('name username password').exec(function(err,user){
					if (err) throw err;
					if (!user){
						res.json({ success : false , message : 'Usuário não encontrado.' });
					} else if (user) {
						var validPassword = user.comparePassword(req.body.password);
						if (!validPassword){
							res.json({ success : false , message : 'Senha inválida.' });
						} else {
							var token = jwt.sign({name : user.name, username : user.username},
												 	superSecret, { expiresInMinutes : 1440 }); //24 horas
							res.json({ success : true , message : 'Token gerado com sucesso.' , token : token });
						}

					}
				});
});

// Chamar o(s) middlewar(es) antes das rotas que eles gerenciam, porque senão a requisição vai direto para a rota

// middleware que vai ser executado em todas as requisições que chegar para a API
apiRouter.use(function(req, res, next){
	console.log('Tem nego entrando aki.') //Cria um log

	// tenta pegar o token do corpo da requisição ou quando ele é passado por parametro no get
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	if (token) {
	// validacao do token

		jwt.verify(token, superSecret, function(err, decoded){
			if (err) {
				return res.status(403).send({ success : false, message : 'Falha na autenticação do token.' });
			} else {
				req.decoded = decoded;
				next(); // Faz com que ele continue executando o fluxo e não pare aqui
			}
		});
	} else {
		return res.status(403).send({ success : false, message : 'Não foi fornecido nenhum token.'})
	}

});

// rota de teste, acessada via GET localhost:porta/api/
apiRouter.get('/', function(req,res){
	res.json({message: "Bem vindo à api."})
});

// rota para retornar o usuário relacionado ao token passado na mensagem
apiRouter.get('/me', function(req,res){
	res.send(req.decoded);
});
// dentro de apiRouter.route('/x') vai gerenciar as requisições que chegam à esse endereço
apiRouter.route('/users')

	// Rota usada para criar um usuário novo, vai ser chamado quando alguem mandar um POST para localhost:porta/api/users
	.post(function(req,res){
	var user = new User();

	// carrega os dados que veio pela requisição em um objeto do tipo User
	user.name = req.body.name;
	user.username = req.body.username;
	user.password = req.body.password;

	user.save(function(err){
		if (err){ // faz tratamento de erros
			// se houver duplicidade de indice, o mongoose retorna o erro 11000
			if (err.code == 11000) return res.json({ success: false, message : 'Já existe usuário com o username '+ user.username +'.'});
			else return res.send(err);
		}
		res.json({ success: true, message : 'Usuário criado com sucesso.'})
	});

	})

	// Rota usada para retornar todos os usuários cadastrados. 
	// vai ser chamado quando alguém mandar um get para localhost:porta/api/users
	.get(function(req,res){
		User.find(function(err,users){
			if(err) res.send(err);
			res.json(users);
		})
	});


// rotas para processar usuários passando o id
apiRouter.route('/users/:user_id')
	
	// vai retornar o usuário com o id que for passado no get para o endereço localhost:porta/api/users/:id
	.get(function(req,res){
		User.findById(req.params.user_id, function(err,user){
			if (err) res.send(err);
			res.json(user);
		});
	})

	// Vai alterar o usuário com o id passado no put, de acordo com os dados passados no corpo da requisição
	.put(function(req,res){
		User.findById(req.params.user_id, function(err,user){ //ele procura o usuário certo
			if (err) res.send(err);
			
			// se tiver os campos na requisição, ele altera o usuário encontrado;

			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;

			user.save(function(err){
				if (err) res.send(err);

				res.json({success : true, message : 'Usuário alterado com sucesso.'});
			});

		});
	})

	// Vai remover o usuário com o id passado no delete
	.delete(function(req,res){
		User.remove({_id : req.params.user_id},function(err,user){
			if (err) return res.send(err);
			res.json({success : true, message : 'Usuário removido com sucesso.'});
		});
	});
	

// pendura o apiRouter em localhost:porta/api
app.use('/api', apiRouter);



// ===================================================================
// Poe o server pra rodar
app.listen(port);
console.log('Roles acontecem na porta '+port);