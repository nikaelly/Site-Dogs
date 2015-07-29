// Importa os pacotes
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


// Definição da estrutura da classe
var UserSchema = new Schema({
	name : String,
	username : { type : String, required: true, index : { unique : true } },
	password : { type : String, required: true, select : false } //nao aparece no select, ao menos que seja explicito
});

//Schema.pre executa funções antes de fazer alguma coisa (parametros aceitos: init, validate, save, remove)
 
// Antes de salvar, criptografa a senha
UserSchema.pre('save',function(next){
	var user = this;
	if (!user.isModified('password')) return next();
	bcrypt.hash(user.password, null, null, function(err, hash){
		if (err) return next(err);
		user.password = hash;
		next();
	});
});


//Schema.methods é um conjunto de métodos definidos pelo usuário

//Metodo para comparar com a senha salva no banco
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
}

// permite que outro método puxe o modelo definido
module.exports = mongoose.model('User', UserSchema);