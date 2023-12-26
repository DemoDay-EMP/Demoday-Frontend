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

    fetch('http://demoday-backend-production.up.railway.app/usuario_pf/create', {
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

function realizarLogoff() {
    localStorage.clear('email');
    localStorage.clear('senha');
    localStorage.clear('cpf');

    window.location.href = 'index.html';
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
    fetch('http://demoday-backend-production.up.railway.app/usuario_pf/login', {
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
                senhaDoUsuario = dataLogin.senha;
                cpfDoUsuario = data.cpf;
                console.log(data, "data");
                console.log(cpfDoUsuario, "exibir cpf no login");
                // Agora, você pode definir o item no localStorage
                localStorage.setItem('email', nomeDoUsuario);
                localStorage.setItem('senha', senhaDoUsuario);
                localStorage.setItem('cpf', cpfDoUsuario);
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

}


function obterInformacoesUsuario() {
    const email = localStorage.getItem('email');
    console.log('Nome do usuário do Local Storage:', email);

    if (!email) {
        console.error('Nome do usuário não encontrado no Local Storage.');
        return;
    }

    console.log('Nome do usuário antes do fetch:', email);

    fetch(`http://demoday-backend-production.up.railway.app/usuario_pf/search/email/${email}`, {
        method: 'GET',
    })
        .then(response => {
            console.log('Status da resposta do fetch:', response.status);
            return response.json();
        })
        .then(data => {
            cpfDoUsuario = data.cpf;
            cepDoUsuario = data.cep;
            console.log('cpf', cpfDoUsuario);
            localStorage.setItem('cep', cepDoUsuario);
            const nomeElementos = document.querySelectorAll('.nomeElement');
            const emailElementos = document.querySelectorAll('.emailElement');
            const dataElementos = document.querySelectorAll('.dataElement');
            const telefoneElementos = document.querySelectorAll('.telefoneElement');
            const cnpjElementos = document.querySelectorAll('.cnpjElement');
            const cepElementos = document.querySelectorAll('.cepElement');

            if (nomeElementos.length > 0) {
                nomeElementos.forEach(elemento => {
                    elemento.innerText = data.nome;
                    elemento.value = data.nome;
                });
                emailElementos.forEach(elemento => {
                    elemento.innerText = data.email;
                    elemento.value = data.email;
                });
                dataElementos.forEach(elemento => {
                    const dataFormatada = formatarDataNascimento(data.dataNascimento);
                    elemento.innerText = dataFormatada;
                    elemento.value = dataFormatada;
                });
                telefoneElementos.forEach(elemento => {
                    elemento.innerText = data.telefone;
                    elemento.value = data.telefone;
                });
                cnpjElementos.forEach(elemento => {
                    elemento.innerText = data.cnpj;
                    elemento.value = data.cnpj;
                });
                cepElementos.forEach(elemento => {
                    elemento.innerText = data.cep;
                    elemento.value = data.cep;
                });
                visualizarDRE();
                visualizarLancamentos()
            } else {
                console.error('Elemento com classe "nomeElement" não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao obter informações do usuário:', error);
        });
}

function formatarDataNascimento(dataNascimento) {
    const data = new Date(dataNascimento);

    // Ajusta o fuso horário
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());

    // Obtém o dia, mês e ano
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // O mês é baseado em zero
    const ano = String(data.getFullYear()).slice(0); // Obtém os dois últimos dígitos do ano

    // Retorna a data formatada
    return `${dia}/${mes}/${ano}`;
}


function formatarDataParaAPI(data) {
    const partesData = data.split('/'); // Supondo que a data fornecida esteja no formato "dd/mm/aaaa"

    // Verifica se há três partes na data (dia, mês, ano)
    if (partesData.length === 3) {
        const [dia, mes, ano] = partesData;

        // Retorna a data no formato "aaaa/mm/dd"
        return `${ano}/${mes}/${dia}`;
    } else {
        console.error('Formato de data inválido:', data);
        return null; // Retorna null se a data estiver em um formato inválido
    }
}


function atualizarInformacoesUsuario() {
    const cpf = localStorage.getItem('cpf');
    const senha = localStorage.getItem('senha');
    const formCadastro = document.getElementById('updating-form');

    const formElements = formCadastro.elements;

    const data = {
        cpf: cpf,
        nome: formElements.nome_completo.value,
        email: formElements.email.value,
        senha: senha,
        cnpj: formElements.cnpj.value,
        dataNascimento: formatarDataParaAPI(formElements.data_nascimento.value),
        telefone: formElements.telefone.value,
        cep: formElements.cep.value,
        status: null,
        dataCadastro: null,
    };

    console.log(data, 'valores do formulário');

    fetch(`http://demoday-backend-production.up.railway.app/usuario_pf/update/cpf/${cpf}`, {
        method: 'PUT',
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
        .then(usuarioAtualizado => {
            console.log(data, 'Usuário atualizado com sucesso');
            window.location.href = 'users-profile.html';
        })
        .catch(error => {
            console.error('Erro:', error);
            exibirMensagemDeErroCadastro(error.message);
        });
}

function deletarUsuario() {
    const cpf = localStorage.getItem('cpf');

    fetch(`http://demoday-backend-production.up.railway.app/usuario_pf/delete/cpf/${cpf}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
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
        console.error('Erro ao excluir usuário:', error);
        window.location.href = 'index.html';
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

function consultaEndereco() {
    let cep = localStorage.getItem('cep');
    let cepError = document.getElementById("cep-error");
    let cidadeInput = document.querySelector('.cidade');
    let enderecoInput = document.querySelector('.endereco');

    if (cep.length === 8) {
        let url = `https://viacep.com.br/ws/${cep}/json/`;

        fetch(url)
            .then(response => response.json())
            .then(dados => {
                if (dados.erro) {
                    cepError.innerHTML = "CEP inválido";
                    cidadeInput.innerHTML = ""; // Limpar campo cidade
                    enderecoInput.value = ""; // Limpar campo endereço
                } else {
                    // cepError.innerHTML = ""; // Limpar mensagem de erro se o CEP for válido
                    cidadeInput.innerHTML = dados.localidade;
                    enderecoInput.innerHTML = dados.logradouro;
                }
            })
            .catch(error => console.error('Erro na requisição:', error));
    } else {
        cepError.innerHTML = "CEP inválido"; // Limpar mensagem de erro se o CEP for válido
        cidadeInput.value = ""; // Limpar campo cidade
        enderecoInput.value = ""; // Limpar campo endereço
    }
}
