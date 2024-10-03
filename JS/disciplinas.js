var id = 0;
var idParaDeletar = null;
var idParaEditar = null;

function abrirModal() {
    document.getElementById('overlay').style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('overlay').style.display = 'none';
}

// Função para salvar os dados da disciplina
function salvarDisciplina() {
    var nome = document.getElementById('nome').value;
    id = id + 1;
    var turma = document.getElementById('turma').value;
    var ch = document.getElementById('ch').value;
    var professor = document.getElementById('professor').value;

    const tbody = document.querySelector('tbody');
    var novaDisciplina = `
        <tr id="disciplina-${id}">
            <td>${"DC" + id.toString().padStart(4, '0')}</td>
            <td>${nome}</td>
            <td>${turma}</td>
            <td>${ch}</td>
            <td>${professor}</td>
            <td>
                <button onclick="gerenciarDisciplina(${id})">Gerenciar</button>
                <div class="opcoesModal" id="opcoesModal${id}">
                    <img class="x-simbolo" src="../icons/x-simbolo.png" onclick="fecharOpcoes()">
                    <p class="opcao editar" onclick="editarDisciplina(${id})">Editar</p>
                    <p class="opcao perfil" onclick="verPerfil(${id})">Perfil</p>
                    <p class="opcao arquivar" onclick="arquivarDisciplina(${id})">Arquivar</p>
                    <p class="opcao deletar" onclick="abrirDeletar(${id})">Deletar</p>
                </div>
            </td>
        </tr>`;
    tbody.innerHTML += novaDisciplina;

    fecharModal();  // Fecha o modal após adicionar a disciplina
}

function gerenciarDisciplina(id) {
    var opcoesModals = document.querySelectorAll('.opcoesModal');
    opcoesModals.forEach(item => {
        item.style.display = "none"; // Fecha todas as opções abertas
    });
    const opcoesModal = document.querySelector(`#opcoesModal${id}`);
    if (opcoesModal) {
        opcoesModal.style.display = "block"; // Abre as opções da disciplina específica
    }
}

// Função para fechar todas as opções abertas
function fecharOpcoes() {
    const opcoesModals = document.querySelectorAll('.opcoesModal');
    opcoesModals.forEach(item => {
        item.style.display = "none";
    });
}

// Função para abrir o modal de confirmação de exclusão
function abrirDeletar(id) {
    idParaDeletar = id; // Armazena o ID da linha a ser deletada
    document.getElementById('overlay1').style.display = "flex";
}

// Função para deletar a disciplina
document.getElementById('deleteBtn').addEventListener('click', function() {
    if (idParaDeletar !== null) {
        const linha = document.getElementById(`disciplina-${idParaDeletar}`);
        if (linha) {
            linha.remove(); // Remove a linha da tabela
        }
        fecharModalDeletar(); // Fecha o modal de confirmação
    }
});

// Função para fechar o modal de confirmação de exclusão
function fecharModalDeletar() {
    document.getElementById('overlay1').style.display = "none";
    idParaDeletar = null; // Limpa o ID armazenado
}

// Função para editar os dados da disciplina
function editarDisciplina(id) {
    idParaEditar = id; // Armazena o ID da linha a ser editada
    const linha = document.getElementById(`disciplina-${id}`);
    if (linha) {
        const nome = linha.children[1].innerText;
        const turma = linha.children[2].innerText;
        const ch = linha.children[3].innerText;
        const professor = linha.children[4].innerText;

        // Preencher o modal de edição com os valores atuais
        document.getElementById('nomeEdit').value = nome;
        document.getElementById('turmaEdit').value = turma;
        document.getElementById('chEdit').value = ch;
        document.getElementById('professorEdit').value = professor;

        // Abrir modal de edição
        document.getElementById('overlay3').style.display = 'block';
    }
}

// Função para salvar a edição dos dados da disciplina
function salvarEdicao() {
    if (idParaEditar !== null) {
        const linha = document.getElementById(`disciplina-${idParaEditar}`);
        if (linha) {
            // Atualizar os valores da linha com os novos valores do modal de edição
            linha.children[1].innerText = document.getElementById('nomeEdit').value;
            linha.children[2].innerText = document.getElementById('turmaEdit').value;
            linha.children[3].innerText = document.getElementById('chEdit').value;
            linha.children[4].innerText = document.getElementById('professorEdit').value;
        }
        fecharModalEdicao(); // Fecha o modal após salvar a edição
    }
}

// Função para fechar o modal de edição
function fecharModalEdicao() {
    document.getElementById('overlay3').style.display = "none";
    idParaEditar = null; // Limpa o ID armazenado
}

// Fechar o modal de exclusão ao clicar no botão de cancelar
document.getElementById('cancelBtn').addEventListener('click', function() {
    fecharModalDeletar();
});
