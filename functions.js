  function Comunicado (codigo,mensagem,descricao)
  {
      this.codigo    = codigo;
      this.mensagem  = mensagem;
      this.descricao = descricao;
      
      this.get = function ()
      {
          return (this.codigo   + " - " + 
                  this.mensagem + " - " +
                  this.descricao);
  
      }
  }

  function gerarBilhete() {
    let codigo = Math.abs(Math.random() * (1000 - 1 + 1) + 1);
    if (codigo !== "") 
    {
          let objBilhete = { codigo: parseInt(codigo), dataentrada: '' };
          let url = `http://localhost:3000/Bilhete/`
  
          let res = axios.post(url, objBilhete)
          .then(response => {
              if (response.data) {
                  const msg = new Comunicado (response.data.codigo, 
                                              response.data.mensagem, 
                                             Math.abs(response.data.descricao));
                  alert(msg.get());
              }
          })
          .catch(error  =>  {
              
              if (error.response) {
                  const msg = new Comunicado (error.response.data.codigo, 
                                              error.response.data.mensagem, 
                                              error.response.data.descricao);
                  alert(msg.get());
              }
          })
    }else
    {
          alert('Erro');
    }
  }

  function gerarCarga(id) {
    
    let codigo = Math.abs(Math.random() * (1000 - 1 + 1) + 1);
    let codFK = document.getElementById('codigo-bilhete').value;
    let tipo = id;
    
    if (codigo !== null) 
    {
          let objCarga = { codCarga: parseInt(codigo), codFK:parseInt(codFK),tipo:tipo, datag: '' };
          let url = `http://localhost:3000/Carga/`
  
          let res = axios.post(url, objCarga)
          .then(response => {
              if (response.data) {
                  const msg = new Comunicado (response.data.codigo, 
                                              response.data.mensagem, 
                                             Math.abs(response.data.descricao));
                  alert(msg.get());
              }
          })
          .catch(error  =>  {
              
              if (error.response) {
                  const msg = new Comunicado (error.response.data.codigo, 
                                              error.response.data.mensagem, 
                                              error.response.data.descricao);
                  alert(msg.get());
              }
          })
    }else
    {
          alert('Todos os dados devem ser preenchidos');
    }
  }

  function historico(){
    let url = `http://localhost:3000/Historico/`

    axios.get(url)
    .then(response => {
        criaLista(response.data)        
    })
    .catch(error  =>  {
        alert(error)    
    })

    const criaLista = ( usos) => {
        const ulUsos = document.getElementById('usos')
        usos.map(uso => {
            const listaUso = document.createElement('li')
            listaUso.innerHTML = `Codigo: ${uso.codigo} -Data de Entrada: ${uso.dataentrada}`
            ulUsos.appendChild(listaVeiculo)
    })
  }
}


