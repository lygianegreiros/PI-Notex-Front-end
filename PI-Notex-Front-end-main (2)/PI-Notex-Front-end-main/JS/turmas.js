let posicaoAbsoluta = 0;
let position = 0;
let conjunto = 0;
let turmas = {};  // Dicionário para armazenar as turmas

function openOverlay() {
    document.querySelector('.overlay').style.display = 'flex';
    if(opcoesModal){
        opcoesModal.style.display = "none";
    }
}

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

function adicionarTurma(serie, classe, ano) {
    document.getElementById('overlay').style.display = 'none';

    if (position == 0) {
        conjunto += 1;  // Incrementa o conjunto corretamente

        // Adiciona uma nova turma ao dicionário de turmas

        // Atualiza o conteúdo da página com a nova turma
        document.getElementById("espacoTurmas").innerHTML += 
            `<div id="conjuntoDeTurmas${conjunto}" class='conjuntoDeTurmas'></div><br>`;
    }
    turmas[conjunto] = {
        serie: serie,
        classe: classe,
        ano: ano
    };
    var nomeDaTurma = `${turmas[conjunto].serie.value} ${turmas[conjunto].classe.value}`;
    
    // Define as cores com base no ciclo do conjunto
    let cor;
    switch (conjunto % 3) {
        case 1:
            cor = 'rgba(0, 84, 149, 0.5)';
            break;
        case 2:
            cor = 'rgba(0, 84, 149, 1)';
            break;
        case 0:
            cor = '#FF8744';
            break;
    }

    // Atualiza a turma existente com a série e classe passadas
    document.getElementById(`conjuntoDeTurmas${conjunto}`).innerHTML += `
        <div class="turmaDiv" id="turma${posicaoAbsoluta+1}" data-ano="${turmas[conjunto].ano.value}">
            <h3>${nomeDaTurma} <span>(${turmas[conjunto].ano.value})</span></h3>
            <img class="elipse" src="../icons/ellipsis-horizontal-outline 9.png" onclick="abrirOpcoes(${posicaoAbsoluta+1})">
            <div class="opcoesModal" id="opcoesModal${posicaoAbsoluta+1}">
                <img class="x-simbolo" src="../icons/x-simbolo.png" onclick="fecharOpcoes()">
                <p class="arquivar">Arquivar</p>
                <p onclick="abrirDeletar(${conjunto})" class="deletar">Deletar</p> <!-- Passar a posição correta -->
            </div>
            <br>
            <p class="idTurma"><img src="../icons/document-lock-outline.svg">ID: MT${(posicaoAbsoluta + 1).toString().padStart(3, '0')}</p>
            <div class="horario-flex">
                <p class="numeroEstudantes"><img src="../icons/people-outline.svg">Estudantes: 0</p>
                <div class="horario-container" style="background-color: ${cor};" data-turma-id='MT${(posicaoAbsoluta + 1).toString().padStart(3, '0')}'>
                    <img src="../icons/calendar-clear-outline 1.svg" class="horasImg"><p>Horário</p>
                </div>
            </div>
            <input type="button" value="Acessar Turma" class="acessarTurma" style="background-color: ${cor};" 
                   onclick="acessarTurmaPerfil('${nomeDaTurma}', '${turmas[conjunto].ano.value}', '${(posicaoAbsoluta + 1).toString().padStart(3, '0')}')">
        </div>
    `;

    position += 1;
    posicaoAbsoluta += 1;

    // Reset position se atingir 3
    if (position == 3) {
        position = 0;
    }

    // Adiciona ano ao select se ainda não estiver presente
    var select = document.getElementById('anoSelect');
    var opcao = turmas[conjunto].ano.value;
    var existe = Array.from(select.options).some(option => option.value === opcao);

    if (!existe) {
        var novaOpcao = document.createElement('option');
        novaOpcao.value = opcao;
        novaOpcao.textContent = opcao;
        select.appendChild(novaOpcao);
    }
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

document.getElementById('espacoTurmas').addEventListener('click', function (event) {
    if (event.target.closest('.horario-container')) {
        const turmaId = event.target.closest('.horario-container').getAttribute('data-turma-id');
        window.location.href = `horario.html?tipo=turma&id=${encodeURIComponent(turmaId)}`;
    }
});

function acessarTurmaPerfil(turma, anoTurma, id){
    window.location.href = `turmaPerfil.html?turma=${encodeURIComponent(turma)}&ano=${encodeURIComponent(anoTurma)}&id=${encodeURIComponent(id)}`;
}

var opcoesModal;
var posicao

function abrirOpcoes(posicao){
    opcoesModal = document.querySelector(`#opcoesModal${posicao}`);
    if(opcoesModal){
        opcoesModal.style.display = "block";
    }
}

function fecharOpcoes(){
    opcoesModal.style.display = "none";
}

function abrirDeletar(posicao){
    var deletarModal = document.getElementById('modal');
    deletarModal.style.display = "flex";
    // Guardar a posição da turma a ser deletada
    deletarModal.setAttribute('data-posicao', posicao);
}

document.getElementById('deleteBtn').addEventListener('click', function() {
    // Recuperar a posição a partir do modal
    const posicao = document.getElementById('modal').getAttribute('data-posicao');
    
    // Deletar a turma do dicionário
    delete turmas[posicao];

    // Remove a div correspondente da página
    console.log(document.getElementById(`turma${posicao}`));
    const turmaADeletar = document.getElementById(`turma${posicao}`);
    if (turmaADeletar) {
        turmaADeletar.remove();
    }

    // Atualiza a posição absoluta
    posicaoAbsoluta -= 1;

    // Opcional: Atualizar os IDs das turmas restantes
    atualizarIdsTurmas();
    document.getElementById('modal').style.display = 'none';
    opcoesModal.style.display = "none";
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

document.getElementById('cancelBtn').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
    opcoesModal.style.display = "none";
});


