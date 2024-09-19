let posicaoAbsoluta = 0;
let position = 0;
let conjunto = 0;
let turmas = {};  // Dicionário para armazenar as turmas

function openOverlay() {
    document.querySelector('.overlay').style.display = 'flex';
}

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}

function adicionarTurma(serie, classe, ano) {
    document.getElementById('overlay').style.display = 'none';

    if (position == 0) {
        conjunto += 1;  // Incrementa o conjunto corretamente

        // Adiciona uma nova turma ao dicionário de turmas
        turmas[conjunto] = {
            serie: serie,
            classe: classe,
            ano: ano
        };

        // Atualiza o conteúdo da página com a nova turma
        document.getElementById("espacoTurmas").innerHTML += 
            `<div id="conjuntoDeTurmas${conjunto}" class='conjuntoDeTurmas'></div><br>`;
    }
    var nomeDaTurma=`${turmas[conjunto].serie.value} ${turmas[conjunto].classe.value}`;
    // Atualiza a turma existente com a série e classe passadas
    document.getElementById(`conjuntoDeTurmas${conjunto}`).innerHTML += `
        <div class="turmaDiv" data-ano="${turmas[conjunto].ano.value}">
            <h3>${nomeDaTurma} <span>(${turmas[conjunto].ano.value})</span></h3>
            <br>
            <p class="idTurma"><img src="../icons/document-lock-outline.svg">ID: MT${(posicaoAbsoluta + 1).toString().padStart(3, '0')}</p>
            <div class="horario-flex">
                <p class="numeroEstudantes"><img src="../icons/people-outline.svg">Estudantes: 0</p>
                <div class="horario-container" data-turma-id='MT${(posicaoAbsoluta + 1).toString().padStart(3, '0')}'>
                    <img src="../icons/calendar-clear-outline.svg" class="horasImg"><p>Horário</p>
                </div>
            </div>
            <input type="button" value="Acessar Turma" class="acessarTurma" onclick="acessarTurmaPerfil('${nomeDaTurma}', '${turmas[conjunto].ano.value}', '${(posicaoAbsoluta + 1).toString().padStart(3, '0')}')">
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
// Função para atualizar a visibilidade das divs com base no ano selecionado
function atualizarDivsPorAno() {
    var anoSelecionado = document.getElementById('anoSelect').value;
    var divs = document.querySelectorAll('.turmaDiv');
    console.log(divs);
    divs.forEach(div => {
        var ano = div.getAttribute('data-ano');
        div.style.display = (ano !== anoSelecionado && anoSelecionado !== '') ? 'none' : 'block';
    });
}

// Adiciona evento para quando o valor selecionado no select mudar
document.getElementById('anoSelect').addEventListener('change', atualizarDivsPorAno);

// Adiciona evento para o botão "Adicionar Turma"
document.getElementById('inputAdicionarTurma').addEventListener('click', function() {
    if (document.getElementById('anoSelect').value !== 'anoOption') {
        console.log(document.getElementById('anoSelect').value);
        atualizarDivsPorAno();
    }
});

// Evento de clique para capturar o ID da turma
document.getElementById('espacoTurmas').addEventListener('click', function (event) {
    if (event.target.closest('.horario-container')) {
        const turmaId = event.target.closest('.horario-container').getAttribute('data-turma-id');
        window.location.href = `horario.html?tipo=turma&id=${encodeURIComponent(turmaId)}`;
    }
});
function acessarTurmaPerfil(turma, anoTurma, id){
    window.location.href = `turmaPerfil.html?turma=${encodeURIComponent(turma)}&ano=${encodeURIComponent(anoTurma)}&id=${encodeURIComponent(id)}`;
}