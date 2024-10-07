let posicaoAbsoluta = 0;
let turmas = {};  // Dicionário para armazenar as turmas
let posicao;
var posicao2;

function openOverlay() {
    document.querySelector('.overlay').style.display = 'flex';
    if (opcoesModal) {
        opcoesModal.style.display = "none";
    }
}

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

async function adicionarTurma(serie, classe, ano) {
    const turmaData = {
        code: `MT${(posicaoAbsoluta + 1).toString().padStart(3, '0')}`, 
        title: `${serie.value} ${classe.value}`,
        year: ano.value.toString(),
        period: parseInt(serie.value)
    };
    console.log(turmaData);
    

    try {
        const response = await fetch('http://localhost:4000/classes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(turmaData)
        });

        const result = await response.json();
        if (response.ok) {
            // Atualiza a UI com a nova turma
            atualizarUIComTurma(result);
        } else {
            console.error('Erro ao criar a turma:', result);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

function atualizarUIComTurma(turma) {
    document.getElementById('overlay').style.display = 'none';
    const posicao = posicaoAbsoluta + 1;
    const nomeDaTurma = turma.title;

    document.getElementById('espacoTurmas').innerHTML += `
        <div class="turmaDiv" id="turma${turma.id}" data-serie="${turma.title}" data-ano="${turma.year}">
            <h3>${nomeDaTurma} <span>(${turma.year})</span></h3>
            <img class="elipse" src="../icons/ellipsis-horizontal-outline 9.png" onclick="abrirOpcoes(${posicao})">
            <div class="opcoesModal" id="opcoesModal${posicao}">
                <img class="x-simbolo" src="../icons/x-simbolo.png" onclick="fecharOpcoes()">
                <p class="arquivar">Arquivar</p>
                <p onclick="abrirDeletar('${turma.id}')" class="deletar">Deletar</p>
            </div>
            <br>
            <p class="idTurma"><img src="../icons/document-lock-outline.svg">ID: ${turma.code.padStart(3, '0')}</p>
            <div class="horario-flex">
                <p class="numeroEstudantes"><img src="../icons/people-outline.svg">Estudantes: 0</p>
                <div class="horario-container" data-turma-id='${turma.code}'>
                    <img src="../icons/calendar-clear-outline 1.svg" class="horasImg"><p>Horário</p>
                </div>
            </div>
            <input type="button" value="Acessar Turma" class="acessarTurma"
                   onclick="acessarTurmaPerfil('${nomeDaTurma}', '${turma.year}', '${turma.code}')">
        </div>
    `;
    posicaoAbsoluta += 1;
}

function acessarTurmaPerfil(turma, anoTurma, id) {
    console.log(anoTurma);
    window.location.href = `turmaPerfil.html?turma=${encodeURIComponent(turma)}&ano=${encodeURIComponent(anoTurma)}&id=${encodeURIComponent(id)}`;
}

var opcoesModal;

function abrirOpcoes(posicao) {
    var opcoesModals = document.querySelectorAll('.opcoesModal');
    opcoesModals.forEach(item => {
        item.style.display = "none";
    });
    opcoesModal = document.querySelector(`#opcoesModal${posicao}`);
    if (opcoesModal) {
        opcoesModal.style.display = "block";
    }
    posicao2 = posicao;
}

function fecharOpcoes() {
    if (opcoesModal) {
        opcoesModal.style.display = "none";
    }
}

async function abrirDeletar(turmaId) {
    var deletarModal = document.getElementById('modal');
    deletarModal.style.display = 'flex';
    posicao2 = turmaId; // Armazena o ID da turma para deletar
    console.log("ID da turma a ser deletada:", turmaId);
}
// Função para buscar todas as turmas do servidor
async function obterTurmas() {
    try {
        const response = await fetch('http://localhost:4000/classes');
        const data = await response.json();

        // Chama a função para exibir turmas na UI
        data.classes.forEach(turma => {
            atualizarUIComTurma(turma);
        });
    } catch (error) {
        console.error('Erro ao buscar turmas:', error);
    }
}

// Chamar a função assim que a página carregar
document.addEventListener('DOMContentLoaded', obterTurmas);

document.getElementById('deleteBtn').addEventListener('click', async function() {
    try {
        const response = await fetch(`http://localhost:4000/classes/${posicao2}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Remove a turma da interface
            document.getElementById(`turma${posicao2}`).remove(); 
            posicaoAbsoluta -= 1; // Atualiza a contagem global

            // Atualiza IDs visíveis (opcional, dependendo do design)
            atualizarIdsTurmas(); 
        } else {
            console.error('Erro ao deletar a turma:', await response.json());
        }

        // Fechar o modal e ocultar as opções
        document.getElementById('modal').style.display = 'none';
        fecharOpcoes();
    } catch (error) {
        alert("Existem alunos relacionados a turma!")
        console.error('Erro na requisição:', error);
    }
});

// Função para atualizar os IDs das turmas restantes
function atualizarIdsTurmas() {
    const divs = document.querySelectorAll('.turmaDiv');
    divs.forEach((div, index) => {
        const turmaId = index + 1;
        const idElement = div.querySelector('.idTurma');
        if (idElement) {
            idElement.innerHTML = `ID: MT${turmaId.toString().padStart(3, '0')}`;
        }
    });
}

function atualizarDivsPorAno() {
    var anoSelecionado = document.getElementById('anoSelect').value;
    var divs = document.querySelectorAll('.turmaDiv');
    divs.forEach(div => {
        var ano = div.getAttribute('data-ano');
        div.style.display = (ano !== anoSelecionado && anoSelecionado !== '') ? 'none' : 'block';
    });
}

document.getElementById('anoSelect').addEventListener('change', atualizarDivsPorAno);

document.getElementById('inputAdicionarTurma').addEventListener('click', function() {
    if (document.getElementById('anoSelect').value !== 'anoOption') {
        atualizarDivsPorAno();
    }
});

document.getElementById('espacoTurmas').addEventListener('click', function(event) {
    if (event.target.closest('.horario-container')) {
        const turmaId = event.target.closest('.horario-container').getAttribute('data-turma-id');
        window.location.href = `horario.html?tipo=turma&id=${encodeURIComponent(turmaId)}`;
    }
});

document.getElementById('cancelBtn').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
    fecharOpcoes();
});
