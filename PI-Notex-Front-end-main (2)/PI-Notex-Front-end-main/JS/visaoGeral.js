const miniCalendario = document.querySelector('#mini-calendario');
const diasContainer = miniCalendario.querySelector('#dias');
const setaEsquerda = miniCalendario.querySelector('#setaEsquerda');
const setaDireita = miniCalendario.querySelector('#setaDireita');
const topoMesAno = miniCalendario.querySelector('#topo p');

let dataAtual = new Date();
let dataFormatada2 = formatarData(dataAtual);
console.log(dataFormatada2);

let anotacoesDados = {};
// Mapeamento dos meses para números
const meses = {
    'janeiro': 1,
    'fevereiro': 2,
    'março': 3,
    'abril': 4,
    'maio': 5,
    'junho': 6,
    'julho': 7,
    'agosto': 8,
    'setembro': 9,
    'outubro': 10,
    'novembro': 11,
    'dezembro': 12
};

// Função para calcular o início da semana (domingo) para qualquer data fornecida
function obterInicioDaSemana(data) {
    const diaDaSemana = data.getDay(); // 0 (domingo) até 6 (sábado)
    const diferenca = data.getDate() - diaDaSemana; // Calcula o início da semana (domingo)
    return new Date(data.setDate(diferenca));
}

// Função para formatar a data no padrão DD/MM/YYYY
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses começam do 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para encontrar e exibir a data com a classe 'selecionado'
function mostrarDataSelecionada() {
    const selecionado = document.querySelector('#dias .selecionado');
    if (selecionado) {
        const dia = selecionado.querySelector('p:last-child').textContent;
        console.log(dia); // Pega o número do dia
        const mesAnoTexto = topoMesAno.textContent.split(' ');
        const mes = String(meses[mesAnoTexto[0].toLowerCase()]); // Converte o nome do mês em número
        const ano = mesAnoTexto[1]; // Ano do topo
        console.log(ano);

        // Verifica se o mês foi corretamente convertido e exibe no console
        if (mes && ano && dia) {
            console.log(dia, mes, ano);
            dataFormatada2 = formatarData(new Date(`${ano}-${mes}-${dia}`));
            console.log(dataFormatada2);
        }
    }
}

// Função para renderizar o calendário com base na semana atual
function renderizarCalendario(data) {
    diasContainer.innerHTML = ''; // Limpa os dias antigos

    const inicioDaSemana = obterInicioDaSemana(new Date(data));
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Atualiza o topo com o mês e ano do primeiro dia da semana
    topoMesAno.textContent = `${inicioDaSemana.toLocaleString('pt-BR', { month: 'long' })} ${inicioDaSemana.getFullYear()}`;

    // Renderiza os dias da semana (do domingo ao sábado)
    for (let i = 0; i < 7; i++) {
        const diaElemento = document.createElement('div');
        const dataDia = new Date(inicioDaSemana);
        dataDia.setDate(inicioDaSemana.getDate() + i);
        console.log(dataDia);

        diaElemento.innerHTML = `
            <p>${diasSemana[i]}</p>
            <p>${dataDia.getDate()}</p>
        `;
        diasContainer.appendChild(diaElemento);

        // Verifica se o dia é o dia atual
        const hoje = new Date();
        if (dataDia.toDateString() === hoje.toDateString()) {
            diaElemento.classList.add('selecionado');
        }
        
        // Adiciona evento de clique para selecionar o dia
        diaElemento.addEventListener('click', () => {
            // Remove a classe 'selecionado' de todos os dias
            document.querySelectorAll('#dias div').forEach(div => div.classList.remove('selecionado'));
            
            // Adiciona a classe 'selecionado' ao dia clicado
            diaElemento.classList.add('selecionado');

            // Exibe a data selecionada no console no formato DD/MM/YYYY
            if(dataDia.getDay==1){
                dataDia.setDate(dataDia.getDate() + 1);
            }
            dataFormatada2 = formatarData(dataDia);
            console.log(dataFormatada2);
            atualizarAnotacoesUI();
        });
    }
    if(dataAtual.getDay==1){
        dataAtual.setDate(dataAtual.getDate() + 1);
    }
    dataFormatada2 = formatarData(dataAtual);
    console.log(dataFormatada2);
    atualizarAnotacoesUI();
    
    // Exibe no console a data inicial com a classe 'selecionado' após renderizar
    mostrarDataSelecionada();
}

// Navegação para a semana anterior
setaEsquerda.addEventListener('click', () => {
    dataAtual.setDate(dataAtual.getDate() - 7); // Subtrai 7 dias para voltar uma semana
    renderizarCalendario(dataAtual);
});

// Navegação para a próxima semana
setaDireita.addEventListener('click', () => {
    dataAtual.setDate(dataAtual.getDate() + 7); // Adiciona 7 dias para avançar uma semana
    renderizarCalendario(dataAtual);
});

// Renderiza o calendário ao carregar a página
renderizarCalendario(dataAtual);

function atualizarAnotacoesUI() {
    // Verifica se há anotações para a data selecionada

    // Atualiza os campos de anotações com base nos dados
    ['anotacao1', 'anotacao2', 'anotacao3'].forEach(id => {
        var titulo = document.querySelector(`#${id} > input[type="text"]`);
        var descricao = document.querySelector(`#${id} > textarea`);
        var hora = document.querySelector(`#${id} input[type="time"]`);
        console.log(anotacoesDados);
        console.log(dataFormatada2);
        if (dataFormatada2 in anotacoesDados) {
            hora.value = anotacoesDados[dataFormatada2][id]?.hora || null;
            titulo.value = anotacoesDados[dataFormatada2][id]?.titulo || 'Título';
            descricao.value = anotacoesDados[dataFormatada2][id]?.descricao || 'Descrição';
        } else {
            hora.value = null;
            titulo.value = 'Título';
            descricao.value = 'Descrição';
        }
    });
}

document.getElementById("anotacao1").addEventListener('input', () => {
    let tituloAnotacao = document.querySelector("#anotacao1 > input[type='text'");
    let descricaoAnotacao = document.querySelector("#anotacao1 > textarea");
    let horaAnotacao = document.querySelector("#anotacao1 input[type='time'");
    
    if (!anotacoesDados[dataFormatada2]) {
        anotacoesDados[dataFormatada2] = {};
    }
    if (!anotacoesDados[dataFormatada2]["anotacao1"]) {
        anotacoesDados[dataFormatada2]["anotacao1"] = {};
    }
    if (tituloAnotacao) {
        anotacoesDados[dataFormatada2]["anotacao1"]["titulo"] = tituloAnotacao.value;
    }
    if (descricaoAnotacao) {
        anotacoesDados[dataFormatada2]["anotacao1"]["descricao"] = descricaoAnotacao.value;
    }
    if (horaAnotacao) {
        anotacoesDados[dataFormatada2]["anotacao1"]["hora"] = horaAnotacao.value;
    }
});

document.getElementById("anotacao2").addEventListener('input', () => {
    let tituloAnotacao = document.querySelector("#anotacao2 > input[type='text'");
    let descricaoAnotacao = document.querySelector("#anotacao2 > textarea");
    let horaAnotacao = document.querySelector("#anotacao2 input[type='time'");
    
    if (!anotacoesDados[dataFormatada2]) {
        anotacoesDados[dataFormatada2] = {};
    }
    if (!anotacoesDados[dataFormatada2]["anotacao2"]) {
        anotacoesDados[dataFormatada2]["anotacao2"] = {};
    }
    if (tituloAnotacao) {
        anotacoesDados[dataFormatada2]["anotacao2"]["titulo"] = tituloAnotacao.value;
    }
    if (descricaoAnotacao) {
        anotacoesDados[dataFormatada2]["anotacao2"]["descricao"] = descricaoAnotacao.value;
    }
    if (horaAnotacao) {
        anotacoesDados[dataFormatada2]["anotacao2"]["hora"] = horaAnotacao.value;
    }
});

document.getElementById("anotacao3").addEventListener('input', () => {
    let tituloAnotacao = document.querySelector("#anotacao3 > input[type='text'");
    let descricaoAnotacao = document.querySelector("#anotacao3 > textarea");
    let horaAnotacao = document.querySelector("#anotacao3 input[type='time'");
    
    if (!anotacoesDados[dataFormatada2]) {
        anotacoesDados[dataFormatada2] = {};
    }
    if (!anotacoesDados[dataFormatada2]["anotacao3"]) {
        anotacoesDados[dataFormatada2]["anotacao3"] = {};
    }
    if (tituloAnotacao) {
        anotacoesDados[dataFormatada2]["anotacao3"]["titulo"] = tituloAnotacao.value;
    }
    if (descricaoAnotacao) {
        anotacoesDados[dataFormatada2]["anotacao3"]["descricao"] = descricaoAnotacao.value;
    }
    if (horaAnotacao) {
        anotacoesDados[dataFormatada2]["anotacao3"]["hora"] = horaAnotacao.value;
    }
});
