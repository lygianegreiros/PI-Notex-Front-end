const urlParams = new URLSearchParams(window.location.search);
const turmaNome = urlParams.get('turma');
const anoTurma = urlParams.get('ano');
const idTurma = urlParams.get('id');
const h1Element = document.querySelector('h1') || 'Turma não encontrada';
h1Element.innerHTML = `<h1>${turmaNome} <span> (${anoTurma})</span></h1>`;
const subtitulo = document.getElementById('descricao') || 'Turma não encontrada';
subtitulo.textContent = `ID: MT${idTurma}`;

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const dataAtual = new Date();
const mes = meses[dataAtual.getMonth()];
const ano = dataAtual.getFullYear();
document.querySelector('h2').textContent = `${mes} ${ano}`;

let dadosAgenda = {}; // Objeto para armazenar os dados temporários

const diaDaSemana = (dataAtual.getDay())+1;
function salvarDados(dia) {
    // Captura os valores dos inputs
    const agendaInputs = document.querySelectorAll('.itemAgenda');
    const horarioInputs = document.querySelectorAll('.itemHorario');
    const materiaInputs = document.querySelectorAll('.materia');

    // Armazena as informações no objeto de dados
    dadosAgenda[dia] = {
        agenda: Array.from(agendaInputs).map(input => input.value),
        horarios: Array.from(horarioInputs).map(input => input.value),
        materias: Array.from(materiaInputs).map(input => input.value)
    };
}

function carregarDados(dia) {
    if (dadosAgenda[dia]) {
        const { agenda, horarios, materias } = dadosAgenda[dia];
        
        // Preenche os campos com os dados salvos
        document.querySelectorAll('.itemAgenda').forEach((input, index) => {
            input.value = agenda[index] || '';
        });
        document.querySelectorAll('.itemHorario').forEach((input, index) => {
            input.value = horarios[index] || '';
        });
        document.querySelectorAll('.materia').forEach((input, index) => {
            input.value = materias[index] || '';
        });
    } else {
        // Limpa os campos se não houver dados para o dia
        document.querySelectorAll('.itemAgenda').forEach(input => input.value = '');
        document.querySelectorAll('.itemHorario').forEach(input => input.value = '');
        document.querySelectorAll('.materia').forEach(input => input.value = '');
    }
}

function selecionarDia(dia) {
    // Salva os dados do dia atualmente selecionado
    const diaSelecionado = document.querySelector('.marca[style="display: block;"]');
    if (diaSelecionado) {
        const idDia = diaSelecionado.parentElement.id;
        salvarDados(idDia);
    }

    // Marca o novo dia selecionado
    document.querySelectorAll('.marca').forEach((marca, index) => {
        marca.style.display = (index === dia - 1) ? 'block' : 'none';
    });

    // Carrega os dados do novo dia
    carregarDados(`dia${dia}`);
}

// Funções para selecionar cada dia
function selecionarDia1() { selecionarDia(1); }
function selecionarDia2() { selecionarDia(2); }
function selecionarDia3() { selecionarDia(3); }
function selecionarDia4() { selecionarDia(4); }
function selecionarDia5() { selecionarDia(5); }
function selecionarDia6() { selecionarDia(6); }
function selecionarDia7() { selecionarDia(7); }

function preencherDiasDaSemana() {
    const hoje = new Date();
    const diaSemanaAtual = hoje.getDay(); // Obtém o dia da semana (0 para domingo, 6 para sábado)
    const diasElementos = [];
    for (let i = 1; i <= 7; i++) {
        diasElementos.push(document.getElementById(`dia${i}`));
    }

    // Preencher os dias
    for (let i = 0; i < 7; i++) {
        const dia = new Date(hoje);
        dia.setDate(hoje.getDate() - diaSemanaAtual + i); // Ajusta o dia da semana
        diasElementos[i].innerHTML = `<td id="dia${i+1}" onclick="selecionarDia${i+1}()"><div class="marca" id="marca${i+1}"></div>${(dia.getDate()).toString().padStart(2, '0')}</td>`;
    }
    selecionarDia(diaDaSemana);
}

document.addEventListener("DOMContentLoaded", preencherDiasDaSemana);
