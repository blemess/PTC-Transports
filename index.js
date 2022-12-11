
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
    
            const sql     = 'CREATE TABLE BILHETE (codigo NUMBER PRIMARY KEY,'+' dataG DATE)';
            await conexao.execute(sql);
            console.log('Tabela criada!');  
			
            
        }
		catch (erro)
		{} // se a já existe, ignora e toca em frente
		
		try{
            const conexao = await this.getConexao ();
            const sql     = 'CREATE TABLE CARGA (codCarga NUMBER PRIMARY KEY,'+' codFK NUMBER NOT NULL,'+' tipo VARCHAR2(8),'+' dataG DATE)';
            await conexao.execute(sql);
            console.log('Tabela criada!');  
			
            
        }
		catch (erro)
		{} // se a já existe, ignora e toca em frente

		try{
            const conexao = await this.getConexao ();
    
            const sql     = 'CREATE TABLE USO (codigo NUMBER PRIMARY KEY,'+' dataG DATE)';
            await conexao.execute(sql);
            console.log('Tabela criada!');  
			
            
        }
		catch (erro)
		{} // se a já existe, ignora e toca em frente
		
	}


}

function BILHETE(bd)
{
    
    this.bd = bd;

    this.inclua = async function (bilhete)
	{
		const conexao = await this.bd.getConexao();
		
		const sql1 = "INSERT INTO BILHETE (codigo,dataG) "+
		             "VALUES (:0,sysdate)";
		const dados = [(Math.abs(bilhete.codigo))];
		console.log(sql1, dados);
		await conexao.execute(sql1,dados);
		
		const sql2 = 'COMMIT';
		await conexao.execute(sql2);	
	}	

	this.verifica = async function(codigo){
		
		const conexao = await this.bd.getConexao();
		
		const sql = "SELECT * FROM BILHETE WHERE CODIGO=:0" ;
		const dados=[codigo];
		ret =  await conexao.execute(sql,dados);
		console.log(ret.rows);
		return ret.rows;
	}
}

//Bilhete

function Bilhete (codigo,dataG)
{
	    this.codigo = codigo;
	    this.dataG = dataG;
}


async function inclusao (req, res)
{
    
    const bilhete = new Bilhete (req.body.codigo,req.body.dataG);
	let data = new Date();
	console.log(data);

    try
    {
		var test = bilhete.codigo;
		var teste = test.toString();

        await  global.Bilhetes.inclua(bilhete);
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

// Carga
function CARGA(bd)
{
    
    this.bd = bd;

    this.inclua = async function (carga)
	{
		const conexao = await this.bd.getConexao();
		
		const sql1 = "INSERT INTO CARGA (codCarga,codFk,tipo,dataG) "+
		             "VALUES (:0,:1,:2,sysdate)";
		const dados = [(carga.codCarga),(carga.codFK),(carga.tipo.toString())];
		console.log(sql1, dados);
		await conexao.execute(sql1,dados);
		
		const sql2 = 'COMMIT';
		await conexao.execute(sql2);	
	}

	this.verifica = async function(codigo){
		
		const conexao = await this.bd.getConexao();
		
		const sql = "SELECT * FROM CARGA WHERE CODIGO=:0" ;
		const dados=[codigo];
		ret =  await conexao.execute(sql,dados);
		console.log(ret.rows);
		return ret.rows;
	}

}

function Carga (codCarga,codFK,tipo,dataG)
{
	    this.codCarga = codCarga;
	    this.codFK   = codFK;
		this.tipo = tipo;
	    this.dataG = dataG;
}

async function inclusaoCarga (req, res)
{

    const carga = new Carga (req.body.codCarga,req.body.codFK,req.body.tipo,req.body.dataG);
	const codigo = req.body.codFK;
	let ret;
	
	try{
		ret = await global.Bilhetes.verifica(codigo);
	}
	catch(erro)
	{}
	if(ret.length == 0){
		console.log('TESTE AQUI');
		const  erro2 = new Comunicado ('LJE','Bilhete inexistente',
		                  'Preencha todos os dados');
        return res.status(409).json(erro2);
	}
	else
		try
		{
			var test = carga.codCarga;
			var teste = test.toString();

			await  global.Cargas.inclua(carga);
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


//Uso

function USO(bd)
{
    
    this.bd = bd;

    this.inclua = async function (uso)
	{
		const conexao = await this.bd.getConexao();
		
		const sql1 = "INSERT INTO USO (codigo,dataG) "+
		             "VALUES (:0,sysdate)";
		const dados = [(Math.abs(uso.codigo))];
		console.log(sql1, dados);
		await conexao.execute(sql1,dados);
		
		const sql2 = 'COMMIT';
		await conexao.execute(sql2);	
	}	

	this.getHistorico = async function (codigo)
	{
		const conexao = await this.bd.getConexao();
		
		const sql = "SELECT codigo,TO_CHAR(dataG, 'YYYY-MM-DD HH24:MI:SS') "+
		            "FROM USO where codigo=:0";
		const dados=[codigo];
		ret =  await conexao.execute(sql,dados);

		return ret.rows;
	}
}

function Uso (codigo,dataG)
{
	    this.codigo = codigo;
	    this.dataG = dataG;
}

async function inclusaoUso(req, res)
{
    
    const uso = new Uso (req.body.codigo,req.body.dataG);
	const codigo = req.body.codigo;
	let ret;
	
	try{
		ret = await global.Cargas.verifica(codigo);
	}
	catch(erro)
	{}
	if(ret.length == 0){
		console.log('TESTE AQUI');
		const  erro2 = new Comunicado ('LJE','Bilhete inexistente',
		                  'Verifique o numero fornecido');
        return res.status(409).json(erro2);
	}

    try
    {
		var test = uso.codigo;
		var teste = test.toString();

        await  global.Usos.inclua(uso);
        const  sucesso = new Comunicado ('Sucesso','Bilhete Usado:',
		                  teste);
        return res.status(201).json(sucesso);
	}
	catch (erro)
	{
		console.log('TESTE AQUI');
		const  erro2 = new Comunicado ('LJE','Bilhete inexistente',
		                  'Não há bilhete cadastrado com o código informado');
        return res.status(409).json(erro2);
    }
}

//historico

async function historico (req, res)
{

	const codigo = req.params.codigo;
    
    let ret;
	try
	{
	    ret = await global.Usos.getHistorico(codigo);
	}    
    catch(erro)
    {}

	if (ret.length==0)
	{
		const erro2 = new Comunicado ('LNE','Bilhete Inexistente',
		                  'Não há bilhete cadastrado com o código informado');
		return res.status(404).json(erro2);
	}
	else
	{
		const ret=[];
		for (i=0;i<rec.length;i++) ret.push (new Uso (rec[i][0],rec[i][1]));
		return res.status(200).json(ret);
	}
} 

//Outros

function Comunicado (codigo,mensagem,descricao)
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




async function ativacaoDoServidor ()
{
    const bd = new BD ();
	await bd.estrutureSe();


    global.Bilhetes = new BILHETE (bd);
	global.Cargas = new CARGA (bd);
	global.Usos = new USO(bd);

    const express = require('express');
    const app     = express();
	const cors    = require('cors')
    
    app.use(express.json());   // faz com que o express consiga processar JSON
    app.use(cors()) //habilitando cors na nossa aplicacao (adicionar essa lib como um middleware da nossa API - todas as requisições passarão antes por essa biblioteca).
    app.use(middleWareGlobal); // app.use cria o middleware global


    app.post  ('/Bilhete'        ,inclusao);
	app.post ('/Carga'           ,inclusaoCarga);
	app.post ('/Uso'             ,inclusaoUso);
	app.get ('/Historico'        ,historico)
    console.log ('Servidor ativo na porta 3000...');
    app.listen(3000);
}

ativacaoDoServidor();

//SE O BILHETE NÃO ESTÁ NO USO, SIGNIFICA QUE ELE NÃO FOI ATIVADO -> BILHETE VÁLIDO.
/*
	select * from USO where codigo =:0

	if (ret.length == 0){
		usar bilhete
	}
	else
		verificar()


*/
//SE O BILHETE ESTÁ NO USO , SIGINIFICA QUE ELE FOI ATIVADO -> FAZER VERIFICAÇÃO DE VALIDADE.