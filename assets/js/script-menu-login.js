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