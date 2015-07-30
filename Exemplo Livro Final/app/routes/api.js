
var User = require('../models/user'), // chama a classe User
	jwt  = require('jsonwebtoken'),   // modulo necessário para gerar os tokens
	config = require('../../config'), // pega as configurações
	superSecret = config.secret;

module.exports = function(app,express) { // para nao dar import duplicado, passa uma instancia do app e do express pra ca quando der o require
	// O apiRouter vai servir como um conjunto de rotas
	var apiRouter = express.Router();


	// gerar o token antes da autenticação do middleware
	// link para a geração de tokens : localhost:porta/api/authenticate
	apiRouter.post('/authenticate',function(req,res,next){
		User.findOne({ username : req.body.username}) // procura o usuario passado pelo corpo da requisição
					.select('name username password').exec(function(err,user){  // precisa dar o select na senha pq o mongoose nao manda
						if (err) throw err;
						if (!user){ // nao encontrou nenhum usuário com o username passado
							res.json({ success : false , message : 'Usuário não encontrado.' });
						} else if (user) {
							var validPassword = user.comparePassword(req.body.password); // compara a senha da requisição com a do banco
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
		console.log('Tem nego mandando requisição.') //Cria um log

		// tenta pegar o token do corpo da requisição ou quando ele é passado por parametro no get
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];
		if (token) {
		// validacao do token

			jwt.verify(token, superSecret, function(err, decoded){
				if (err) { // não validou, cancela a rota
					return res.status(403).send({ success : false, message : 'Falha na autenticação do token.' });
				} else {
					req.decoded = decoded; // salva o objeto decodificado (usuário) para usar mais tarde
					next(); // Faz com que ele continue executando o fluxo e não pare aqui
				}
			});
		} else {
			return res.status(403).send({ success : false, message : 'Não foi fornecido nenhum token.'})
		}

	});

	// O primeiro parametro do app/apiRouter.get é o endereço da rota a ser tratada e o segundo é uma função do que fazer
	// quando acontecer um get naquele endereço

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
			

			// carrega os dados que veio pela requisição em um objeto do tipo User
			var user = new User();
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
	return apiRouter; // quem der require('api.js')(app, express) vai poder usar o apiRouter definido aqui
};