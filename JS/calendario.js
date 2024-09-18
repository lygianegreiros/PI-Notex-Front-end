let dataAtual = new Date();
var dataSelecionada=new Date();

document.addEventListener('DOMContentLoaded', function() {
    const setaEsquerda = document.getElementById('setaEsquerda');
    const setaDireita = document.getElementById('setaDireita');
    const mesAno = document.getElementById('mesAno');
    const diasContainer = document.getElementById('dias');
    const agendaContainer = document.getElementById('agenda-container');
    const calendarioSemana = document.getElementById('calendarioSemana');
    const diaDoMes = document.getElementById('diaDoMes');
    
    let eventosPorMes = {};
    let eventosPorSemana = {};
    let eventosPorDia = {};
     // Armazena eventos apenas durante a sessão

    // Atualiza o cabeçalho do mês e ano
    function atualizarCalendario() {
        var inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateDayInput(input);
            });
        });
        const opcoesMes = { month: 'long', year: 'numeric' };
        mesAno.textContent = dataAtual.toLocaleDateString('pt-BR', opcoesMes);
        atualizarDias();
        carregarEventos();
    }

    // Calcula o número de dias no mês atual
    function obterNumeroDiasNoMes(mes, ano) {
        return new Date(ano, mes + 1, 0).getDate();
    }

    // Renderiza os dias no calendário
    function atualizarDias() {
        var inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateDayInput(input);
            });
        });
        diasContainer.innerHTML = ''; // Limpa os dias anteriores
        const numeroDias = obterNumeroDiasNoMes(dataAtual.getMonth(), dataAtual.getFullYear());
        const primeiroDiaSemana = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1).getDay();

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
        agendaContainer.innerHTML = ''; // Limpa a agenda anterior
        var chaveMes = `${dataSelecionada.getMonth() + 1}-${dataSelecionada.getFullYear()}`;
        var eventosMes = eventosPorMes[chaveMes] || [];

        var chaveDia = `${dataSelecionada.getDate()}-${dataSelecionada.getMonth() + 1}-${dataSelecionada.getFullYear()}`;
        console.log(chaveDia);
        var eventosDia = eventosPorDia[chaveDia] || [];

        // Inicializa 3 campos fixos de anotação
        for (let i = 0; i < 3; i++) {
            if(document.getElementById('buttonMes').classList.contains('active')){
                var evento = eventosMes[i] || { dia: '', texto: '' };
            }
            else if(document.getElementById('buttonDia').classList.contains('active')){
                var evento = eventosDia[i] || { dia: '', texto: '' };
            }
            const anotacao = document.createElement('div');
            anotacao.classList.add('anotacao');
            anotacao.innerHTML = `
                <input type="number" placeholder="Dia" value="${evento.dia}">
                <textarea placeholder="Evento">${evento.texto}</textarea>
            `;
            agendaContainer.appendChild(anotacao);
        }
    }

    // Salva os eventos do mês atual na memória temporária
    function salvarEventos() {
        const eventos = [];
        const anotacoes = agendaContainer.querySelectorAll('.anotacao');

        anotacoes.forEach(anotacao => {
            const dia = anotacao.querySelector('input').value;
            const texto = anotacao.querySelector('textarea').value;
            if (dia && texto) {
                eventos.push({ dia, texto });
                var chaveDia = `${dia}-${dataAtual.getMonth() + 1}-${dataAtual.getFullYear()}`;
                eventosPorDia[chaveDia] = eventos;
                console.log(eventosPorDia);
            }
        });

        var chaveMes = `${dataAtual.getMonth() + 1}-${dataAtual.getFullYear()}`;
        eventosPorMes[chaveMes] = eventos; // Salva na memória temporária
    }
    

    // Muda o mês e atualiza o calendário
    function mudarMes(delta) {
        salvarEventos(); // Salva os eventos antes de mudar o mês
        dataAtual.setMonth(dataAtual.getMonth() + delta);
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
        var semana = Math.ceil((diasDesdePrimeiroDiaAno + (primeiroDiaAno.getDay() || 7)) / 7);
        mesAno.textContent = `Semana ${semana}, ${dataAtual.getFullYear()}`;
        console.log(chavesMes.getMonth(), dataAtual.getMonth());
    }

    function navegarSemana(delta) {
        dataAtual.setDate(dataAtual.getDate() + (delta * 7));
        atualizarSemana();
    }

    // Atualiza a visualização do dia
    function atualizarDia() {
        carregarEventos();
        var inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateDayInput(input);
            });
        });
        diaDoMes.innerHTML = ''; // Limpa o dia atual anterior
        const diaAtual = document.createElement('div');
        diaAtual.textContent = dataAtual.getDate();
        diaDoMes.appendChild(diaAtual);
        const diaDaSemana = dataAtual.getDay();
        // Cria um array com os nomes dos dias da semana
        const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        // Obtém o nome do dia da semana correspondente
        const nomeDoDia = diasDaSemana[diaDaSemana];
        document.getElementById('dias-semana').innerHTML=`<div> ${nomeDoDia}</div>`;
        diaDoMes.style.display = 'block'; // Garante que o dia atual seja exibido
        dataSelecionada=dataAtual;
        console.log(dataSelecionada);
        mesAno.textContent = dataAtual.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Configura os botões de navegação
    setaEsquerda.addEventListener('click', function() {
        if (document.querySelector('.view-option:nth-child(2)').classList.contains('active')) {
            navegarSemana(-1); // Semana anterior
        } else if (document.querySelector('.view-option:nth-child(3)').classList.contains('active')) {
            dataAtual.setDate(dataAtual.getDate() - 1);
            atualizarDia();
        } else {
            mudarMes(-1); // Mês anterior
        }
    });

    setaDireita.addEventListener('click', function() {
        if (document.querySelector('.view-option:nth-child(2)').classList.contains('active')) {
            navegarSemana(1); // Próxima semana
        } else if (document.querySelector('.view-option:nth-child(3)').classList.contains('active')) {
            dataAtual.setDate(dataAtual.getDate() + 1);
            atualizarDia();
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
        document.getElementById('dias-semana').innerHTML=`<div>Dom</div> <div>Seg</div> <div>Ter</div> <div>Qua</div> <div>Qui</div> <div>Sex</div>  <div>Sáb</div>`
        atualizarSemana();
    }

    function showMonthView() {
        salvarEventos();
        calendarioSemana.style.display = 'none';
        diaDoMes.style.display = "none";
        document.querySelector('.active').classList.remove('active');
        mesAno.textContent = dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        document.querySelector('.view-option:nth-child(1)').classList.add('active');
        document.getElementById('dias-semana').innerHTML=`<div>Dom</div> <div>Seg</div> <div>Ter</div> <div>Qua</div> <div>Qui</div> <div>Sex</div>  <div>Sáb</div>`
        diasContainer.style.display = 'flex';
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
    }
});

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

document.addEventListener('DOMContentLoaded', function() {
    var inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateDayInput(input);
        });
    });
});