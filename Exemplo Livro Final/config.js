// Arquivo de configuração do servidor

// exports define quais variáveis serão visíveis quando algum outro arquivo der require neste
module.exports = {
	'port' : process.env.PORT || 8080, // número da porta que o servidor vai rodar.
	'database' : 'mongodb://localhost:27017/testelivrofinal', // caminho para o banco
	'secret' : 'baconbaconbacon' //segredo para ser usado na geração dos tokens
}