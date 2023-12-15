function realizarLancamento() {
    console.log("Testando");
    const cpf = localStorage.getItem('cpf');
    const formLancamento = document.getElementById('transaction-form');
    
    // Use o FormData apenas se estiver lidando com um formulário que faz upload de arquivos.
    // Se não, você pode criar um objeto diretamente.
    const formDataCadastroUsuario = new FormData(formLancamento);

    const valorInput = formLancamento.valor.value;
  
    const valor = valorInput.replace(',', '.');
  
    // Obtendo valores diretamente do formulário
    const data = {
        cpf: cpf,
        valor: valor,
        tipo_conta: formLancamento.tipoConta.value,
        data_lancamento: formLancamento.dataLancamento.value,
        tipo_lancamento: formLancamento.tipoLancamento.value,
        contaDestino: formLancamento.contaDestino.value,
        forma_pagamento: formLancamento.formaPagamento.value,
        observacao: formLancamento.observacao.value,
        // status_lancamento: formLancamento.pagamentoRealizado.value,
    };
  
    console.log(data, "Testando");
  
    fetch('http://localhost:8091/transaction/create', {
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
        window.location.href = 'dashboard.html';
    })
    .catch(error => {
        console.error('Erro:', error);
        exibirMensagemDeErroCadastro(error.message);
        console.log(data, "Não Funcionou");
    });
  }

function visualizarDRE() {
    const cpf = localStorage.getItem('cpf');
    console.log('cpf', cpf)

    fetch(`http://localhost:8091/transaction/cpf/${cpf}`, {
        method: 'GET',
    })
        .then(response => {
            console.log('Status da resposta do fetch:', response.status);
            return response.json();
        })
        .then(data => {
            const elementoReceitaBruta = document.getElementById('receitaBruta');
            const elementoDeducoesReceita = document.getElementById('deducaoReceita');
            const elementoReceitaLiquida = document.getElementById('receitaLiquida');
            const elementoCustos = document.getElementById('custos');
            const elementoResultadoBruto = document.getElementById('resultadoBruto');
            const elementoDespesasOperacionais = document.getElementById('despesasOperacionais');
            const elementoResultadoFinanceiro = document.getElementById('resultadoFinanceiro');
            const elementoOutrasReceitas = document.getElementById('outrasReceitas');
            const elementoIrpjCSLL = document.getElementById('irpjCSLL');
            const elementoParticipacoes = document.getElementById('participacoes');
            const elementoResultadoFinal = document.getElementById('resultadoFinal');
            console.log(elementoReceitaBruta);
            console.log(data);

            const elementoSaldoAtual = document.getElementById('saldoAtual');
            const elementoReceitas = document.getElementById('receitas');
            const elementoDespesas = document.getElementById('despesas');
            const elementoSaldoInicial = document.getElementById('saldoInicial');
            const elementoSaldoPrevisto = document.getElementById('saldoPrevisto');

            if (data.length > 0) {



                // ----- RECEITAS ----- \\
                const receitas = data.filter(transaction => transaction.tipo_conta === 'Receita');
                // Soma os valores das transações filtradas
                const totalReceitas = receitas.reduce((total, transaction) => total + transaction.valor, 0);
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const receitasFormatado = totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoReceitas.innerText = "R$ " + receitasFormatado;

                // ----- DESPESAS ----- \\
                const despesas = data.filter(transaction => transaction.tipo_conta === 'Despesa');
                // Soma os valores das transações filtradas
                const totalDespesas = despesas.reduce((total, transaction) => total + transaction.valor, 0);
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const despesasFormatado = totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoDespesas.innerText = "R$ " + despesasFormatado;

                // ----- SALDO ATUAL ----- \\
                const totalSaldoAtual = totalReceitas - totalDespesas;
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const saldoAtualFormatado = totalSaldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoSaldoAtual.innerText = "R$ " + saldoAtualFormatado;

                // ----- SALDO INICIAL ----- \\
                const saldoInicialReceita = data.filter(transaction => transaction.data_lancamento === '2023-12-01' && transaction.tipo_conta === 'Receita');
                const saldoInicialDespesa = data.filter(transaction => transaction.data_lancamento === '2023-12-01' && transaction.tipo_conta === 'Despesa');
                // Soma os valores das transações filtradas
                const totalSaldoInicialReceita = saldoInicialReceita.reduce((total, transaction) => total + transaction.valor, 0);
                const totalSaldoInicialDespesa = saldoInicialDespesa.reduce((total, transaction) => total + transaction.valor, 0);
                const totalSaldoInicial = totalSaldoInicialReceita - totalSaldoInicialDespesa;
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const saldoInicialFormatado = totalSaldoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoSaldoInicial.innerText = "R$ " + saldoInicialFormatado;

                // ----- SALDO PREVISTO ----- \\
                const saldoPrevistoReceita = data.filter(transaction => transaction.tipo_conta === 'Receita');
                const saldoPrevistoDespesa = data.filter(transaction => transaction.tipo_conta === 'Despesa');
                // Soma os valores das transações filtradas
                const totalSaldoPrevistoReceita = saldoPrevistoReceita.reduce((total, transaction) => total + transaction.valor, 0);
                const totalSaldoPrevistoDespesa = saldoPrevistoDespesa.reduce((total, transaction) => total + transaction.valor, 0);
                const totalSaldoPrevisto = totalSaldoPrevistoReceita - totalSaldoInicialDespesa;
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const saldoPrevistoFormatado = totalSaldoPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoSaldoPrevisto.innerText = "R$ " + saldoPrevistoFormatado;


                // ----- RECEITA BRUTA ----- \\
                // Filtra as transações com tipo "Venda de produto"
                const receitaBruta = data.filter(transaction => transaction.tipo_lancamento === 'Venda de produto' || transaction.tipo_lancamento === 'Prestação de serviço');
                // Soma os valores das transações filtradas
                const totalReceitaBruta = receitaBruta.reduce((total, transaction) => total + transaction.valor, 0);
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const receitaBrutaFormatado = totalReceitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoReceitaBruta.innerText = "R$ " + receitaBrutaFormatado;

                // ----- DEDUÇÕES DA RECEITA ----- \\
                // Filtra as transações com tipo "Venda de produto"
                const deducoesReceita = data.filter(transaction => transaction.tipo_lancamento === 'ICMS' || transaction.tipo_lancamento === 'PIS' || transaction.tipo_lancamento === 'COFINS' || transaction.tipo_lancamento === 'IPI');
                // Soma os valores das transações filtradas
                const totalDeducoesReceita = deducoesReceita.reduce((total, transaction) => total + transaction.valor, 0);
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const deducoesReceitaFormatado = totalDeducoesReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoDeducoesReceita.innerText = "R$ " + deducoesReceitaFormatado;

                // ----- RECEITA LÍQUIDA ----- \\
                const receitaLiquida = totalReceitaBruta - totalDeducoesReceita;
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const receitaLiquidaFormatado = receitaLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoReceitaLiquida.innerText = "R$ " + receitaLiquidaFormatado;

                // ----- CUSTO ----- \\
                const custos = data.filter(transaction => transaction.tipo_lancamento === 'Frete' || transaction.tipo_lancamento === 'Embalagens' || transaction.tipo_lancamento === 'Custos com Produto' || transaction.tipo_lancamento === 'Custos com Serviços');
                // Soma os valores das transações filtradas
                const totalCustos = custos.reduce((total, transaction) => total + transaction.valor, 0);
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const custosFormatado = totalCustos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoCustos.innerText = "R$ " + custosFormatado;

                // ----- RESULTADO BRUTO ----- \\
                const resultadoBruto = receitaLiquida - totalCustos;
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const resultadoBrutoFormatado = resultadoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoResultadoBruto.innerText = "R$ " + resultadoBrutoFormatado;

                // ----- DESPESAS OPERACIONAIS ----- \\ Trocar o "tipo_lancamento === 'colocar valores'"
                const despesasOperacionais = data.filter(transaction => transaction.tipo_lancamento === 'Água' || transaction.tipo_lancamento === 'Aluguel' || transaction.tipo_lancamento === 'Condomínio' || transaction.tipo_lancamento === 'FGTS' || transaction.tipo_lancamento === 'INSS' || transaction.tipo_lancamento === 'Luz' || transaction.tipo_lancamento === 'Internet' || transaction.tipo_lancamento === 'Material de escritório' || transaction.tipo_lancamento === 'Material de consumo' || transaction.tipo_lancamento === 'Salário');
                // Soma os valores das transações filtradas
                const totalDespesasOperacionais = despesasOperacionais.reduce((total, transaction) => total + transaction.valor, 0);
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const despesasOperacionaisFormatado = totalDespesasOperacionais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoDespesasOperacionais.innerText = "R$ " + despesasOperacionaisFormatado;

                // ----- RESULTADO FINANCEIRO ----- \\ Trocar o "tipo_lancamento === 
                const resultadoFinanceiroReceita = data.filter(transaction => transaction.tipo_lancamento === 'Rendimento financeiro');
                
                const totalResultadoFinanceiroReceita = resultadoFinanceiroReceita.reduce((total, transaction) => total + transaction.valor, 0);

                const resultadoFinanceiroDespesa = data.filter(transaction => transaction.tipo_lancamento === 'Tarifas Bancárias' || transaction.tipo_lancamento === 'Juros e multas');

                const totalResultadoFinanceiroDespesa = resultadoFinanceiroDespesa.reduce((total, transaction) => total + transaction.valor, 0);

                // Soma os valores das transações filtradas
                const totalResultadoFinanceiro = totalResultadoFinanceiroReceita - totalResultadoFinanceiroDespesa;
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const resultadoFinanceiroFormatado = totalResultadoFinanceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoResultadoFinanceiro.innerText = "R$ " + resultadoFinanceiroFormatado;

                // ----- OUTRAS RECEITAS ----- \\ Trocar o "tipo_lancamento === 
                const outrasReceitas = data.filter(transaction => transaction.tipo_lancamento === 'Outras Receitas');
                // Soma os valores das transações filtradas
                const totalOutrasReceitas = outrasReceitas.reduce((total, transaction) => total + transaction.valor, 0);
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const outrasReceitasFormatado = totalOutrasReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoOutrasReceitas.innerText = "R$ " + outrasReceitasFormatado;

                // ----- IRPJ E CSLL ----- \\ Não há opção no modal ainda 
                // const irpjCSLL = data.filter(transaction => transaction.tipo_lancamento === 'custos');
                // // Soma os valores das transações filtradas
                // const totalIrpjCSLL = irpjCSLL.reduce((total, transaction) => total + transaction.valor, 0);
                // // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                // const irpjCSLLFormatado = totalIrpjCSLL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // // Exibe o total na página
                const totalIrpjCSLL = 0;
                const irpjCSLLFormatado = "0,00"; // Apagar ao arrumar modal
                elementoIrpjCSLL.innerText = "R$ " + irpjCSLLFormatado;

                // ----- PARTICIPAÇÕES ----- \\ Não há opção no modal ainda 
                // const participacoes = data.filter(transaction => transaction.tipo_lancamento === 'custos');
                // // Soma os valores das transações filtradas
                // const totalParticipacoes = participacoes.reduce((total, transaction) => total + transaction.valor, 0);
                // // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                // const participacoesFormatado = totalParticipacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // // Exibe o total na página
                const totalParticipacoes = 0;
                const participacoesFormatado = "0,00"; // Apagar ao arrumar modal
                elementoParticipacoes.innerText = "R$ " + participacoesFormatado;

                // ----- RESULTADO FINAL DO EXERCÍCIO ----- \\ Trocar o "tipo_lancamento === 
                const resultadoFinal = resultadoBruto - totalDespesasOperacionais + totalResultadoFinanceiro + totalOutrasReceitas - totalIrpjCSLL - totalParticipacoes;
                // Formata o dado para utilizar duas casas decimais e "," ao invés de "."
                const resultadoFinalFormatado = resultadoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                // Exibe o total na página
                elementoResultadoFinal.innerText = "R$ " + resultadoFinalFormatado;


            } else {
                elemento.innerText = 0;
                elementoReceitaBruta.innerText = 0;
                elementoDeducoesReceita.innerText = 0;
                elementoReceitaLiquida.innerText = 0;
                console.error('Elemento com classe "nomeElement" não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao obter informações do usuário:', error);
        });
}

// Inicialize a tabela fora da função filtrarTabela
const tabela = new simpleDatatables.DataTable('.datatable', {
    perPageSelect: [5, 10, 15, ["All", -1]],
    columns: [{
        select: 2,
        sortSequence: ["desc", "asc"]
    },
    {
        select: 3,
        sortSequence: ["desc"]
    },
    {
        select: 4,
        cellClass: "green",
        headerClass: "red"
    }]
});

function visualizarLancamentos() {
    const cpf = localStorage.getItem('cpf');

    fetch(`http://localhost:8091/transaction/cpf/${cpf}`, {
        method: 'GET',
    })
        .then(response => {
            console.log('Status da resposta do fetch:', response.status);
            return response.json();
        })
        .then(data => {
            const tabelaBody = document.getElementById('tabelaBody');
            console.log(tabelaBody);
            console.log(data);

            if (data.length > 0) {
                tabela.destroy(); // Destrua a instância anterior da tabela

                data.forEach(result => {
                    // Criar uma nova linha para cada resultado
                    const novaLinha = tabelaBody.insertRow();

                    // Adicionar células à nova linha
                    const cellNome = novaLinha.insertCell(0);
                    const cellTipoConta = novaLinha.insertCell(1);
                    const cellObservacoes = novaLinha.insertCell(2);
                    const cellData = novaLinha.insertCell(3);
                    const cellValor = novaLinha.insertCell(4);

                    // Preencher as células com os valores do resultado
                    cellNome.innerText = result.tipo_lancamento;
                    cellTipoConta.innerText = result.tipo_conta;
                    cellObservacoes.innerText = result.observacao;
                    cellData.innerText = result.data_lancamento;
                    cellValor.innerText = 'R$ ' + result.valor;
                });

                tabela.init(); // Reinicialize a tabela com os novos dados
            } else {
                console.error('Elemento com classe "tabelaBody" não encontrado ou nenhum dado retornado pela API.');
            }
        })
        .catch(error => {
            console.error('Erro ao obter informações do usuário:', error);
        });
}

