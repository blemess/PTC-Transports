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

  //Função para geração do bilhete 
  function gerarBilhete() {
    let codigo = Math.abs(Math.random() * (1000 - 1 + 1) + 1); //geração de um número aleatório entre 1 e 1000
    let now = new Date(); //data do bilhete gerado
    let horaG = now.getHours()+ ':' + now.getMinutes(); //hora do bilhete gerado
    if (codigo !== "") 
    {
          let objBilhete = { codigo: parseInt(codigo), horaG: horaG, dataentrada: '' }; //criação do objeto Bilhete
          let url = `http://localhost:3000/Bilhete/`//link
  
          let res = axios.post(url, objBilhete) // API AXIOS para integração front/back-end
          .then(response => {
              if (response.data) {
                  const msg = new Comunicado (response.data.codigo, 
                                              response.data.mensagem, 
                                             Math.abs(response.data.descricao));
                  alert(msg.get());//geração e exibição da mensagem de sucesso
              }
          })
          .catch(error  =>  {
              
              if (error.response) {
                  const msg = new Comunicado (error.response.data.codigo, 
                                              error.response.data.mensagem, 
                                              error.response.data.descricao);
                  alert(msg.get()); //geração e exibição da mensagem de erro
              }
          })
    }else
    {
          alert('Erro'); //mensagem de erro
    }
  }

  function gerarCarga(id) {
    
    let codigo = Math.abs(Math.random() * (1000 - 1 + 1) + 1); //geração de um número aleatório entre 1 e 1000
    let codFK = document.getElementById('codigo-bilhete').value; //codigo do bilhete fornecido pelo usuario
    let tipo = id; //tipo de recarga
    
    if (codigo !== null && quantidade !== null) //Verificação se todos os dados estão preenchidos
    {
          let objCarga = { codCarga: parseInt(codigo), codFK:parseInt(codFK),tipo:tipo,quantidade:parseInt(quantidade), datag: '' };//criação do objeto Recarga
          let url = `http://localhost:3000/Carga/`//link
  
          let res = axios.post(url, objCarga) //API AXIOS para integração front/back-end
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
          alert('Todos os dados devem ser preenchidos'); //mensagem de erro
    }
  }



