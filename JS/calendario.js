let dataAtual = new Date();
var dataSelecionada = new Date();
const agendaContainer = document.getElementById('agenda-container');
const setaEsquerda = document.getElementById('setaEsquerda');
const setaDireita = document.getElementById('setaDireita');
const mesAno = document.getElementById('mesAno');
const diasContainer = document.getElementById('dias');
const calendarioSemana = document.getElementById('calendarioSemana');
const diaDoMes = document.getElementById('diaDoMes');
var anotacoes = agendaContainer.querySelectorAll('.anotacao');
var semana;

let eventosPorMes = {};
let eventosPorSemana = {};
let eventosPorDia = {};

// Atualiza o cabeçalho do mês e ano
function atualizarCalendario() {
    var inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            validateDayInput(input);
        });
    });
    const opcoesMes = { month: 'long', year: 'numeric' };
    mesAno.textContent = dataSelecionada.toLocaleDateString('pt-BR', opcoesMes);
    atualizarDias();
    carregarEventos();
}

// Calcula o número de dias no mês atual
function obterNumeroDiasNoMes(mes, ano) {
    return new Date(ano, mes + 1, 0).getDate();
}

// Renderiza os dias no calendário
function atualizarDias() {
    diasContainer.innerHTML = ''; // Limpa os dias anteriores
    const numeroDias = obterNumeroDiasNoMes(dataSelecionada.getMonth(), dataSelecionada.getFullYear());
    const primeiroDiaSemana = new Date(dataSelecionada.getFullYear(), dataSelecionada.getMonth(), 1).getDay();

    // Preenche os dias da semana antes do primeiro dia do mês
    for (let i = 0; i < primeiroDiaSemana; i++) {
        const diaVazio = document.createElement('div');
        diaVazio.classList.add('vazio'); // Classe CSS para os dias vazios
        diasContainer.appendChild(diaVazio);
    }

    // Adiciona os dias do mês
    for (let dia = 1; dia <= numeroDias; dia++) {
        const diaDiv = document.createElement('div');
        diaDiv.textContent = dia;
        diasContainer.appendChild(diaDiv);
    }

    // Preencher dias vazios no final, se necessário
    const totalDias = primeiroDiaSemana + numeroDias;
    const diasRestantes = 7 - (totalDias % 7);
    if (diasRestantes < 7) {
        for (let i = 0; i < diasRestantes; i++) {
            const diaVazio = document.createElement('div');
            diaVazio.classList.add('vazio');
            diasContainer.appendChild(diaVazio);
        }
    }
}

// Carrega eventos específicos do mês a partir da memória temporária
function carregarEventos() {
    agendaContainer.innerHTML = '<h2>Agenda</h2>'; // Limpa a agenda anterior
    var chaveMes = `${dataSelecionada.getMonth() + 1}-${dataSelecionada.getFullYear()}`;
    console.log(chaveMes);
    console.log(eventosPorMes);
    var eventosMes = eventosPorMes[chaveMes] || [];
    console.log(eventosMes);
    var chaveDia = `${dataSelecionada.getDate()}-${dataSelecionada.getMonth() + 1}-${dataSelecionada.getFullYear()}`;
    var eventosDia = eventosPorDia[chaveDia] || [];
    console.log(eventosPorSemana);
    console.log(semana);
    console.log(eventosPorDia);
    var eventosSemana = eventosPorSemana[`${semana}, ${dataSelecionada.getFullYear()}`] || [];
    console.log(eventosSemana);
    // Inicializa 3 campos fixos de anotação
    for (let i = 0; i < 4; i++) {
        if (document.getElementById('buttonMes').classList.contains('active')) {
            var evento = eventosMes[i] || { dia: '', texto: '' };
        }
        else if (document.getElementById('buttonDia').classList.contains('active')) {
            var evento = eventosDia[i] || { dia: '', texto: '' };
        }
        else if (document.getElementById('buttonSemana').classList.contains('active')) {
            var evento = eventosSemana[i] || { dia: '', texto: '' };
        }
        console.log(evento);
        var anotacao = document.createElement('div');
        anotacao.classList.add('anotacao');
        if (document.querySelector('.view-option:nth-child(3)').classList.contains('active')) {
            anotacao.innerHTML = `
            <textarea placeholder="Evento">${evento.texto}</textarea>
        `;
        } else {
            anotacao.innerHTML = `
                <input type="number" placeholder="Dia" value="${evento.dia}">
                <textarea placeholder="Evento">${evento.texto}</textarea>
            `;
        }
        agendaContainer.appendChild(anotacao);
        console.log(eventosPorDia);
    }
}

// Salva os eventos do mês atual na memória temporária
function removerDuplicados(array) {
    const eventosUnicos = [];
    const chavesUnicas = new Set(); // Usado para verificar duplicatas

    array.forEach(evento => {
        const chave = `${evento.dia}-${evento.texto}`; // Chave única para cada evento
        if (!chavesUnicas.has(chave)) {
            chavesUnicas.add(chave);
            eventosUnicos.push(evento);
        }
    });

    return eventosUnicos;
}

// Salva os eventos do mês atual na memória temporária
function salvarEventos() {
    console.log(eventosPorDia);
    var anotacoes = agendaContainer.querySelectorAll('.anotacao');
    let eventos = []; // Reinicializar o array de evento
    indice = 0;

    anotacoes.forEach((anotacao, indice) => {
        console.log(indice);
        let dia;

        // Determina o dia com base no botão ativo
        if (document.getElementById('buttonDia').classList.contains('active')) {
            dia = dataSelecionada.getDate();
        } else {
            var inputElement = anotacao.querySelector('input');
            if (inputElement) {
                dia = inputElement.value;
            } else {
                console.log('Elemento input não encontrado na anotação');
                dia = ''; // Definir dia como vazio
            }
        }

        var texto = anotacao.querySelector('textarea').value;
        console.log(texto);

        // Limpar campos se ambos dia e texto estiverem vazios
        if (!dia && !texto) {
            if (inputElement) inputElement.value = ''; // Limpa o input de dia
            anotacao.querySelector('textarea').value = ''; // Limpa o textarea
            return; // Sair da iteração
        }

        // Se o dia ou texto forem modificados, atualizar o dicionário
        var mesSelecionado = dataSelecionada.getMonth() + 1; // Mês selecionado (1 a 12)
        var anoSelecionado = dataSelecionada.getFullYear();
        var chaveDiaAntiga = `${anotacao.dataset.dia}-${mesSelecionado}-${anoSelecionado}`; // Armazenar o dia antigo
        var chaveDiaNova = `${dia}-${mesSelecionado}-${anoSelecionado}`; // Nova chave com o dia atualizado

        if (chaveDiaAntiga !== chaveDiaNova) {
            // Remover o evento da chave antiga se existir
            if (eventosPorDia[chaveDiaAntiga]) {
                eventosPorDia[chaveDiaAntiga] = eventosPorDia[chaveDiaAntiga].filter((_, idx) => idx !== indice);
                if (eventosPorDia[chaveDiaAntiga].length === 0) {
                    delete eventosPorDia[chaveDiaAntiga];
                }
            }
        }

        // Atualizar o texto e o dia na nova chave
        if (!eventosPorDia[chaveDiaNova]) {
            eventosPorDia[chaveDiaNova] = [];
        }

        // Atualizar ou adicionar o evento
        if (dia && texto) {
            eventosPorDia[chaveDiaNova][indice] = { dia, texto };
        }

        // Remover duplicados em eventosPorDia antes de salvar
        eventosPorDia[chaveDiaNova] = removerDuplicados(eventosPorDia[chaveDiaNova]);

        // Atualizar o dataset do elemento para refletir o novo dia
        anotacao.dataset.dia = dia;

        // Atualizar eventosPorMes e eventosPorSemana
        let c1 = 0;
        for (let data of Object.keys(eventosPorDia)) {
            let [dia, mes, ano] = data.split('-');
            let chave = `${mes}-${ano}`;

            if (!eventosPorMes[chave]) {
                eventosPorMes[chave] = [];
            }

            for (let c3 = 0; c3 < 4; c3++) {
                if (eventosPorDia[data][c3]) {
                    eventosPorMes[chave][c1] = eventosPorDia[data][c3];
                    c1++;
                }
            }
        }

        c1 = 0;
        for (let data of Object.keys(eventosPorDia)) {
            let [dia, mes, ano] = data.split('-');
            mes = parseInt(mes) - 1;
            var primeiroDiaAno2 = new Date(ano, 0, 1);
            var diasDesdePrimeiroDiaAno2 = Math.floor((new Date(ano, mes, dia) - primeiroDiaAno2) / (24 * 60 * 60 * 1000));
            var chaveSemana = `${Math.ceil((diasDesdePrimeiroDiaAno2 + (primeiroDiaAno2.getDay() || 7)) / 7)}, ${ano}`;

            if (!eventosPorSemana[chaveSemana]) {
                eventosPorSemana[chaveSemana] = [];
            }

            for (let c3 = 0; c3 < 4; c3++) {
                if (eventosPorDia[data][c3]) {
                    eventosPorSemana[chaveSemana][c1] = eventosPorDia[data][c3];
                    c1++;
                }
            }
        }
    });

    console.log(eventos);
    console.log(eventosPorDia);
    console.log(eventosPorMes);
    console.log(eventosPorSemana);
}


// Muda o mês e atualiza o calendário
function mudarMes(delta) {
    salvarEventos(); // Salva os eventos antes de mudar o mês
    dataSelecionada.setMonth(dataSelecionada.getMonth() + delta);
    atualizarCalendario();
}

// Atualiza a visualização da semana
function atualizarSemana() {
    salvarEventos();
    calendarioSemana.innerHTML = ''; // Limpa a visualização anterior
    const startOfWeek = dataAtual.getDate() - dataAtual.getDay() + (dataAtual.getDay() === 0 ? -6 : 1); // Começa na segunda-feira
    const endOfWeek = startOfWeek + 6;

    for (let i = startOfWeek; i <= endOfWeek; i++) {
        const dia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), i);
        const diaDiv = document.createElement('div');
        diaDiv.textContent = dia.getDate();
        calendarioSemana.appendChild(diaDiv);
    }
    var primeiroDiaAno = new Date(dataAtual.getFullYear(), 0, 1);
    var diasDesdePrimeiroDiaAno = Math.floor((dataAtual - primeiroDiaAno) / (24 * 60 * 60 * 1000));
    semana = Math.ceil((diasDesdePrimeiroDiaAno + (primeiroDiaAno.getDay() || 7)) / 7);
    mesAno.textContent = `Semana ${semana}, ${dataAtual.getFullYear()}`;
}

function navegarSemana(delta) {
    dataAtual.setDate(dataAtual.getDate() + (delta * 7));
    atualizarSemana();
    carregarEventos();
}

// Atualiza a visualização do dia
function atualizarDia() {
    carregarEventos();
    diaDoMes.innerHTML = ''; // Limpa o dia atual anterior
    const diaAtual = document.createElement('div');
    diaAtual.textContent = dataAtual.getDate();
    diaDoMes.appendChild(diaAtual);
    const diaDaSemana = dataAtual.getDay();
    // Cria um array com os nomes dos dias da semana
    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    // Obtém o nome do dia da semana correspondente
    const nomeDoDia = diasDaSemana[diaDaSemana];
    document.getElementById('dias-semana').innerHTML = `<div> ${nomeDoDia}</div>`;
    diaDoMes.style.display = 'block'; // Garante que o dia atual seja exibido
    dataSelecionada = dataAtual;
    mesAno.textContent = dataAtual.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Configura os botões de navegação
setaEsquerda.addEventListener('click', function () {
    if (document.querySelector('.view-option:nth-child(2)').classList.contains('active')) {
        navegarSemana(-1); // Semana anterior
    } else if (document.querySelector('.view-option:nth-child(3)').classList.contains('active')) {
        salvarEventos();
        dataAtual.setDate(dataAtual.getDate() - 1);
        atualizarDia(); // Limpa as anotações quando o dia está ativo
        var inputs = document.querySelectorAll('.anotacao input');
        inputs.forEach(input => {
            input.style.display = 'none'; // Esconde o input
        });
    } else {
        mudarMes(-1); // Mês anterior
    }
});

setaDireita.addEventListener('click', function () {
    if (document.querySelector('.view-option:nth-child(2)').classList.contains('active')) {
        navegarSemana(1); // Próxima semana
    } else if (document.querySelector('.view-option:nth-child(3)').classList.contains('active')) {
        salvarEventos();
        dataAtual.setDate(dataAtual.getDate() + 1);
        atualizarDia();
        var inputs = document.querySelectorAll('.anotacao input');
        inputs.forEach(input => {
            input.style.display = 'none'; // Esconde o input
        });
        anotacoes.forEach(anotacao => {
            console.log(anotacao.querySelector('textarea').value);
        });
    } else {
        mudarMes(1); // Próximo mês
    }
});


// Inicializa a visualização do calendário
atualizarCalendario();

// Configuração dos botões de visualização
document.querySelector('.view-option:nth-child(2)').addEventListener('click', showWeekView);
document.querySelector('.view-option:nth-child(1)').addEventListener('click', showMonthView);
document.querySelector('.view-option:nth-child(3)').addEventListener('click', showDayView);

function showWeekView() {
    salvarEventos();
    document.querySelector('.active').classList.remove('active');
    document.querySelector('.view-option:nth-child(2)').classList.add('active');
    diasContainer.style.display = 'none'; // Limpa dias antigos
    diaDoMes.style.display = "none";
    calendarioSemana.style.display = 'flex';
    document.getElementById('dias-semana').innerHTML = `<div>Dom</div> <div>Seg</div> <div>Ter</div> <div>Qua</div> <div>Qui</div> <div>Sex</div>  <div>Sáb</div>`
    atualizarSemana();
    carregarEventos();
}

function showMonthView() {
    salvarEventos();
    calendarioSemana.style.display = 'none';
    diaDoMes.style.display = "none";
    document.querySelector('.active').classList.remove('active');
    mesAno.textContent = dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    document.querySelector('.view-option:nth-child(1)').classList.add('active');
    document.getElementById('dias-semana').innerHTML = `<div>Dom</div> <div>Seg</div> <div>Ter</div> <div>Qua</div> <div>Qui</div> <div>Sex</div>  <div>Sáb</div>`
    diasContainer.style.display = 'flex';
    carregarEventos();
}

function showDayView() {
    salvarEventos();
    calendarioSemana.style.display = 'none';
    diasContainer.style.display = 'none';
    diaDoMes.style.display = "block";
    document.querySelector('.active').classList.remove('active');
    document.querySelector('.view-option:nth-child(3)').classList.add('active');
    atualizarDia();
    carregarEventos();
    if (document.querySelector('.view-option:nth-child(3)').classList.contains('active')) {
        var inputs = document.querySelectorAll('.anotacao input');
        inputs.forEach(input => {
            console.log("a");
            input.style.display = 'none'; // Esconde o input
        });
    }
}

function getLastDayOfMonth() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1; // Mês atual (0 a 11, então +1)
    return new Date(year, month, 0).getDate();
}

function validateDayInput(input) {
    var lastDay = getLastDayOfMonth();
    let value = input.value;

    // Remove qualquer caractere que não seja número
    value = value.replace(/\D/g, '');

    // Se o valor for menor que 1, redefine para 1
    if (parseInt(value, 10) < 1) {
        input.value = 1;
    }
    // Se o valor for maior que o último dia do mês, redefine para o último dia
    else if (parseInt(value, 10) > lastDay) {
        input.value = value[0];
    } else {
        input.value = value;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            validateDayInput(input);
        });
    });
});