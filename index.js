
function BD ()
{
	process.env.ORA_SDTZ = 'UTC-3'; // garante horário de Brasília
	
	this.getConexao = async function ()
	{
		if (global.conexao)
			return global.conexao;

        const oracledb = require('oracledb');
        const dbConfig = require('./dbconfig.js');
        
        try
        {
		    global.conexao = await oracledb.getConnection(dbConfig);
		}
		catch (erro)
		{
			console.log ('Não foi possível estabelecer conexão com o BD!');
			process.exit(1);
		}

		return global.conexao;
	}

	this.estrutureSe = async function ()
	{
		try{
            const conexao = await this.getConexao ();
    
            const sql     = 'CREATE TABLE BILHETE (codigo NUMBER PRIMARY KEY,'+' horaG VARCHAR2(8),'+' dataG DATE)';
            await conexao.execute(sql);
            console.log('Tabela criada!');  
			
            
        }
		catch (erro)
		{} // se a já existe, ignora e toca em frente
		
		try{
            const conexao = await this.getConexao ();
            const sql     = 'CREATE TABLE CARGA (codCarga NUMBER PRIMARY KEY,'+' codFK NUMBER NOT NULL,'+' tipo VARCHAR2(8),'+'quantidade NUMBER NOT NULL,'+' dataG DATE)';
            await conexao.execute(sql);
            console.log('Tabela criada!');  
			
            
        }
		catch (erro)
		{} // se a já existe, ignora e toca em frente
		
	}


}

function BILHETE(bd) //clase Bilhete
{
    
    this.bd = bd;

    this.inclua = async function (bilhete) //função para incluir um bilhete na tabela Bilhete do banco de dados
	{
		const conexao = await this.bd.getConexao();//aguardando conexao com o banco de dados
		
		const sql1 = "INSERT INTO BILHETE (codigo,horaG,dataG) "+
		             "VALUES (:0,:1,sysdate)";    //string para o insert na Tabela Bilhete
		const dados = [(Math.abs(bilhete.codigo)),(bilhete.horaG)]; //criação do obejto
		console.log(sql1, dados);
		await conexao.execute(sql1,dados); //execução do commando
		
		const sql2 = 'COMMIT'; 
		await conexao.execute(sql2);	//execução do commando
	}	

}

function CARGA(bd) //classe Carga
{
    
    this.bd = bd;

    this.inclua = async function (carga)  //função para incluir um bilhete na tabela Carga do banco de dados
	{
		const conexao = await this.bd.getConexao(); //aguardando conexao com o banco de dados
		
		const sql1 = "INSERT INTO CARGA (codCarga,codFk,tipo,quantidade,dataG) "+
		             "VALUES (:0,:1,:2,:3,sysdate)"; //string para o insert na Tabela Carga
		const dados = [(carga.codCarga),(carga.codFK),(carga.tipo.toString()),(carga.quantidade)];
		console.log(sql1, dados);
		await conexao.execute(sql1,dados); //execução do commando
		
		const sql2 = 'COMMIT';
		await conexao.execute(sql2);	//execução do commando
	}	

}

function Bilhete (codigo,horaG,dataG) //construtor do bilhete
{
	    this.codigo = codigo;
	    this.horaG   = horaG;
	    this.dataG = dataG;
}
function Carga (codCarga,codFK,tipo,quantidade,dataG) //construtor da carga
{
	    this.codCarga = codCarga;
	    this.codFK   = codFK;
		this.tipo = tipo;
		this.quantidade = quantidade;
	    this.dataG = dataG;
}


function Comunicado (codigo,mensagem,descricao) //construtor do comunicado
{
	this.codigo    = codigo;
	this.mensagem  = mensagem;
	this.descricao = descricao;
}


function middleWareGlobal (req, res, next)
{
    console.time('Requisição'); // marca o início da requisição
    console.log('Método: '+req.method+'; URL: '+req.url); // retorna qual o método e url foi chamada

    next(); // função que chama as próximas ações

    console.log('Finalizou'); // será chamado após a requisição ser concluída

    console.timeEnd('Requisição'); // marca o fim da requisição
}

async function inclusao (req, res) //função para fazer a Inclusão do Bilhete
{
    
    const bilhete = new Bilhete (req.body.codigo,req.body.horaG,req.body.dataG);

    try
    {
		var test = bilhete.codigo;
		var teste = test.toString();

        await  global.Bilhetes.inclua(bilhete); //chamada da função que inclui no bd
        const  sucesso = new Comunicado ('Sucesso','Numero do Bilhete ',
		                  teste);
        return res.status(201).json(sucesso);
	}
	catch (erro)
	{
		console.log('TESTE AQUI');
		const  erro2 = new Comunicado ('LJE','Bilhete existente',
		                  'Não há bilhete cadastrado com o código informado');
        return res.status(409).json(erro2);
    }
}

async function inclusaoCarga (req, res) //função para fazer a inclussão da Recarga
{

    const carga = new Carga (req.body.codCarga,req.body.codFK,req.body.tipo,req.body.quantidade,req.body.dataG);
    try
    {
		var test = carga.codCarga;
		var teste = test.toString();

        await  global.Cargas.inclua(carga); //chamada da função que inclui no bd
        const  sucesso = new Comunicado ('Sucesso','Numero da Carga ',
		                  teste);
        return res.status(201).json(sucesso);
	}
	catch (erro)
	{
		console.log('TESTE AQUI');
		const  erro2 = new Comunicado ('LJE','Bilhete inexistente',
		                  'Preencha todos os dados');
        return res.status(409).json(erro2);
    }
}

async function ativacaoDoServidor () //função para fazer a primeira ativação do servidor 
{
    const bd = new BD (); //criação do banco
	await bd.estrutureSe(); //criação das tabelas


    global.Bilhetes = new BILHETE (bd); //criação das 
	global.Cargas = new CARGA (bd); // classes

    const express = require('express');
    const app     = express();
	const cors    = require('cors')
    
    app.use(express.json());   // faz com que o express consiga processar JSON
    app.use(cors()) //habilitando cors na nossa aplicacao (adicionar essa lib como um middleware da nossa API - todas as requisições passarão antes por essa biblioteca).
    app.use(middleWareGlobal); // app.use cria o middleware global


    app.post  ('/Bilhete'        , inclusao); //link para a integração back-front
	app.post ('/Carga'            ,inclusaoCarga);//link para a integração back-front
    console.log ('Servidor ativo na porta 3000...');
    app.listen(3000); //porta que o servidor ouvirá
}

ativacaoDoServidor(); //ativação do servidor
