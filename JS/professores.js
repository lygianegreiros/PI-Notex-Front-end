var id = 0; // Declaração única
let idParaDeletar = null; // Variável global para armazenar o ID a ser deletado
let idParaEditar = null; // Variável global para armazenar o ID a ser editado

// Função para abrir o modal de cadastro
function abrirModal() {
    document.getElementById('overlay2').style.display = 'block';
}

// Função para fechar o modal de cadastro
function fecharModal() {
    document.getElementById('overlay2').style.display = 'none';
}

// Função para salvar os dados do professor
function salvarProfessor() {
    const nome = document.getElementById('nome').value;
    id++; // Incrementa o ID para garantir unicidade
    const disciplina = document.getElementById('disciplina').value;
    const turma = document.getElementById('turma').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;

    const tbody = document.querySelector('tbody');
    const novoProfessor = `
        <tr id="professor-${id}">
            <td><div class="bola"></div></td>
            <td>${nome}</td>
            <td>${"PR"+id.toString().padStart(2, '0')}</td>
            <td>${disciplina}</td>
            <td>${turma}</td>
            <td>${telefone}</td>
            <td>${endereco}</td>
            <td>
                <button onclick="gerenciarProfessor(${id})">Gerenciar</button>
                <div class="opcoesModal" id="opcoesModal${id}">
                    <img class="x-simbolo" src="../icons/x-simbolo.png" onclick="fecharOpcoes()">
                    <p class="opcao editar" onclick="editarEstudante(${id})">Editar</p>
                    <p class="opcao perfil" onclick="verPerfil(${id})">Perfil</p>
                    <p class="opcao arquivar" onclick="arquivarEstudante(${id})">Arquivar</p>
                    <p class="opcao deletar" onclick="abrirDeletar(${id})">Deletar</p>
                </div>
            </td>
        </tr>`;
    tbody.innerHTML += novoProfessor;

    fecharModal();  // Fecha o modal após adicionar o professor
}

// Função para gerenciar as opções de um professor
function gerenciarProfessor(id) {
    var opcoesModals = document.querySelectorAll('.opcoesModal');
    opcoesModals.forEach(item => {
        item.style.display = "none"; // Fecha todas as opções abertas
    });
    const opcoesModal = document.querySelector(`#opcoesModal${id}`);
    if (opcoesModal) {
        opcoesModal.style.display = "block"; // Abre as opções do professor específico
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

// Função para deletar o professor
document.getElementById('deleteBtn').addEventListener('click', function() {
    if (idParaDeletar !== null) {
        const linha = document.getElementById(`professor-${idParaDeletar}`);
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

// Função para editar os dados do professor
function editarEstudante(id) {
    idParaEditar = id; // Armazena o ID da linha a ser editada
    const linha = document.getElementById(`professor-${id}`);
    if (linha) {
        const nome = linha.children[1].innerText;
        const turma = linha.children[4].innerText;
        const telefone = linha.children[5].innerText;
        const endereco = linha.children[6].innerText;

        // Preencher o modal de edição com os valores atuais
        document.getElementById('nomeEdit').value = nome;
        document.getElementById('turmaEdit').value = turma;
        document.getElementById('telefoneEdit').value = telefone;
        document.getElementById('enderecoEdit').value = endereco;

        // Abrir modal de edição
        document.getElementById('overlay3').style.display = 'block';
    }
}

// Função para salvar a edição dos dados do professor
function salvarEdicao() {
    if (idParaEditar !== null) {
        const linha = document.getElementById(`professor-${idParaEditar}`);
        if (linha) {
            // Atualizar os valores da linha com os novos valores do modal de edição
            linha.children[1].innerText = document.getElementById('nomeEdit').value;
            linha.children[4].innerText = document.getElementById('turmaEdit').value;
            linha.children[5].innerText = document.getElementById('telefoneEdit').value;
            linha.children[6].innerText = document.getElementById('enderecoEdit').value;
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
