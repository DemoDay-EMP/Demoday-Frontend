var usuario;

function exibirMensagemDeErroLogin(message) {
    const mensagemDeErroElemento = document.getElementById('mensagem-de-erro-login');
    if (message) {
        mensagemDeErroElemento.innerText = message;
    } else {
        mensagemDeErroElemento.innerText = 'Erro desconhecido.';
    }
}

function exibirMensagemDeErroCadastro(message) {
    const mensagemDeErroElemento = document.getElementById('mensagem-de-erro-cadastro');
    if (message) {
        mensagemDeErroElemento.innerText = message;
    } else {
        mensagemDeErroElemento.innerText = 'Erro desconhecido.';
    }
}

function avancar() {
    const form_cadastro = document.getElementById('registration-form');
    const formDataCadastroUsuario = new FormData(form_cadastro);

    const data = {
        email: formDataCadastroUsuario.get('email'),
        senha: formDataCadastroUsuario.get('senha'),
    };

    localStorage.setItem('email', data.email);
    localStorage.setItem('senha', data.senha);
    window.location.href = 'events.html';
    
}

function cadastrarUsuario() {
  const email = localStorage.getItem('email');
  const senha = localStorage.getItem('senha');
  const formCadastro = document.getElementById('registration-form');
  
  // Use o FormData apenas se estiver lidando com um formulário que faz upload de arquivos.
  // Se não, você pode criar um objeto diretamente.
  const formDataCadastroUsuario = new FormData(formCadastro);

  // Obtendo valores diretamente do formulário
  const data = {
      email: email,
      senha: senha,
      cnpj: formCadastro.cnpj.value,
      cpf: formCadastro.cpf.value,
      nome: formCadastro.nome.value,
      dataNascimento: formCadastro.dataNascimento.value,
      telefone: formCadastro.telefone.value,
      cep: formCadastro.cep.value,
  };

  console.log(data, "Testando");

  fetch('http://localhost:8091/usuario_pf/create', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then(response => {
      if (!response.ok) {
          return response.json().then(data => {
              throw new Error(data.message);
          });
      }
      return response.json();
  })
  .then(data => {
      window.location.href = 'index.html';
  })
  .catch(error => {
      console.error('Erro:', error);
      exibirMensagemDeErroCadastro(error.message);
      console.log(data, "Não Funcionou");
  });
}



function login() {
    const form_login = document.getElementById('login-form');
    const formDataLogin = new FormData(form_login);
    let nomeDoUsuario = ""; // Isso está definindo o nomeDoUsuario como uma string vazia

    const dataLogin = {};
    formDataLogin.forEach((value, key) => {
        dataLogin[key] = value;
    });

    console.log(dataLogin, "dataLogin");
    fetch('http://localhost:8091/usuario_pf/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataLogin),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Erro desconhecido');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.message === 'Login bem-sucedido') {
                // Corrige o problema: atualiza nomeDoUsuario com o valor real
                nomeDoUsuario = dataLogin.email;
                console.log(data, "data");
                // Agora, você pode definir o item no localStorage
                localStorage.setItem('email', nomeDoUsuario);
                // Redirecionar para a página restrita
                window.location.href = 'dashboard.html';
            } else {
                // Exibir mensagem de erro (usuário não encontrado ou senha incorreta)
                exibirMensagemDeErroLogin(data.error || 'Usuário não encontrado');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            exibirMensagemDeErroLogin(error.message);
        });
        console.log(data, "data");
        localStorage.getItem('usuario');

}


function obterInformacoesUsuario() {
    const email = localStorage.getItem('email');
    console.log('Nome do usuário do Local Storage:', email);

    if (!email) {
        console.error('Nome do usuário não encontrado no Local Storage.');
        return;
    }

    console.log('Nome do usuário antes do fetch:', email);

    fetch(`http://localhost:8091/usuario_pf/search/email/${email}`, {
        method: 'GET',
    })
        .then(response => {
            console.log('Status da resposta do fetch:', response.status);
            return response.json();
        })
        .then(data => {
            const nomeElementos = document.querySelectorAll('.nomeElement');
            const emailElementos = document.querySelectorAll('.emailElement');

            if (nomeElementos.length > 0) {
                nomeElementos.forEach(elemento => {
                    elemento.innerText = data.nome;
                });
                emailElementos.forEach(elemento => {
                  elemento.innerText = data.email;
              });
            } else {
                console.error('Elemento com classe "nomeElement" não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao obter informações do usuário:', error);
        });
}





const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  pwShowHide = document.querySelectorAll(".pw_hide");

formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));

pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});

