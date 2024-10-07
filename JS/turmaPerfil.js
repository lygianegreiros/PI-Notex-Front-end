const urlParams = new URLSearchParams(window.location.search);
const turmaNome = urlParams.get('turma') || 'Turma não encontrada';
const anoTurma = urlParams.get('ano') || '';
const idTurma = urlParams.get('id') || 'N/A';

const h1Element = document.querySelector('h1');
if (h1Element) {
    h1Element.innerHTML = `${turmaNome} <span> (${anoTurma})</span>`;
}

const subtitulo = document.getElementById('descricao');
if (subtitulo) {
    subtitulo.textContent = `ID: MT${idTurma}`;
}

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const dataAtual = new Date();
const mes = meses[dataAtual.getMonth()];
const ano = dataAtual.getFullYear();
document.querySelector('h2').textContent = `${mes} ${ano}`;

let dadosAgenda = {}; // Objeto para armazenar os dados temporários

const diaDaSemana = dataAtual.getDay() + 1;

function salvarDados(dia) {
    const agendaInputs = document.querySelectorAll('.itemAgenda');
    const horarioInputs = document.querySelectorAll('.itemHorario');
    const materiaInputs = document.querySelectorAll('.materia');

    dadosAgenda[dia] = {
        agenda: Array.from(agendaInputs).map(input => input.value),
        horarios: Array.from(horarioInputs).map(input => input.value),
        materias: Array.from(materiaInputs).map(input => input.value)
    };
}

function carregarDados(dia) {
    if (dadosAgenda[dia]) {
        const { agenda, horarios, materias } = dadosAgenda[dia];

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
        document.querySelectorAll('.itemAgenda, .itemHorario, .materia').forEach(input => {
            input.value = '';
        });
    }
}

function selecionarDia(dia) {
    const diaSelecionado = document.querySelector('.marca[style="display: block;"]');
    if (diaSelecionado) {
        const idDia = diaSelecionado.parentElement.id;
        salvarDados(idDia);
    }

    document.querySelectorAll('.marca').forEach((marca, index) => {
        marca.style.display = (index === dia - 1) ? 'block' : 'none';
    });

    carregarDados(`dia${dia}`);
}

function preencherDiasDaSemana() {
    const hoje = new Date();
    const diaSemanaAtual = hoje.getDay(); 
    const diasElementos = [];

    for (let i = 1; i <= 7; i++) {
        diasElementos.push(document.getElementById(`dia${i}`));
    }

    for (let i = 0; i < 7; i++) {
        const dia = new Date(hoje);
        dia.setDate(hoje.getDate() - diaSemanaAtual + i); 
        diasElementos[i].innerHTML = `<td id="dia${i+1}" onclick="selecionarDia(${i+1})"><div class="marca" id="marca${i+1}"></div>${(dia.getDate()).toString().padStart(2, '0')}</td>`;
    }
    selecionarDia(diaDaSemana);
}

document.addEventListener("DOMContentLoaded", preencherDiasDaSemana);

var modal = document.getElementById("studentModal");
var btn = document.getElementById("addStudentBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function consultarEstudante() {
    var nome = document.getElementById('nomeDoEstudante').value;
    if (!nome) return; // Verifica se o nome não está vazio

    const tbody = document.querySelector('tbody');
    var novoEstudante = `
        <tr id="estudante-${nome}">
            <td><div class="bola"></div></td>
            <td>${nome}</td>
            <td></td>
            <td>
                <button onclick="gerenciarConsultar('${nome}')">Gerenciar</button>
                <div class="opcoesModal" id="opcoesModal${nome}">
                    <img class="x-simbolo" src="../icons/x-simbolo.png" onclick="fecharOpcoes()">
                    <p class="opcao perfil" onclick="verPerfil('${nome}')">Perfil</p>
                    <p class="opcao arquivar" onclick="arquivarConsultar('${nome}')">Arquivar</p>
                    <p class="opcao deletar" onclick="abrirDeletar('${nome}')">Deletar</p>
                </div>
            </td>
        </tr>`;
    tbody.innerHTML += novoEstudante;
    modal.style.display = "none";
}

function gerenciarConsultar(nome) {
    document.querySelectorAll('.opcoesModal').forEach(item => item.style.display = "none");
    const opcoesModal = document.getElementById(`opcoesModal${nome}`);
    if (opcoesModal) {
        opcoesModal.style.display = "block";
    }
}

function fecharOpcoes() {
    document.querySelectorAll('.opcoesModal').forEach(item => item.style.display = "none");
}

function abrirDeletar(nome) {
    nomeParaDeletar = nome;
    document.getElementById('overlay1').style.display = "flex";
}

document.getElementById('deleteBtn').addEventListener('click', function() {
    if (nomeParaDeletar !== null) {
        const linha = document.getElementById(`estudante-${nomeParaDeletar}`);
        if (linha) {
            linha.remove();
        }
        fecharModalDeletar();
    }
});

function fecharModalDeletar() {
    document.getElementById('overlay1').style.display = "none";
    nomeParaDeletar = null;
}

document.getElementById('cancelBtn').addEventListener('click', fecharModalDeletar);
