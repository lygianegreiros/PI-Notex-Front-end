let idParaEditar = null;
let id = 0;
let idParaDeletar = null; // Variável para armazenar o ID do estudante a ser deletado
var paginaAtual=1;
const dataList = document.getElementById('turmaList');
var turmaId;

// Função para abrir o modal de adição
function abrirModal() {
    document.getElementById('overlay2').style.display = 'block';
}

// Função para fechar o modal de adição
function fecharModal() {
    document.getElementById('overlay2').style.display = 'none';
}
async function salvarEstudante() {
    const nome = document.getElementById('nome').value;
    const turmaCode = document.getElementById('turma').value;
    const telefone = document.getElementById('telefone').value;
    const foto = document.getElementById('perfilUrl').value;
    const cpf = document.getElementById('cpf').value;
    const senhaEstudante = document.getElementById('senhaEstudante').value;
    const email = document.getElementById('email').value;

    // Verificar se a turma existe no dicionário turmaIdMap
    turmaId = turmaIdMap[turmaCode];

    if (!turmaId) {
        console.error('Código de turma inválido');
        return;
    }

    const estudanteData = {
        name: nome,
        phone: telefone,
        cpf: cpf,
        email: email,
        password: senhaEstudante,
        isActive: true,
        avatarUrl: foto,
        role: 'STUDENT',
    };

    const response = await fetch(`http://localhost:4000/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(estudanteData)
    });

    if (response.ok) {
        const data = await response.json(); // Obtém o corpo da resposta
        console.log('ID gerado pelo banco de dados:', data.id); // Mostra o ID no console
        console.log('Estudante salvo com sucesso!');
        fecharModal(); // Fecha o modal após o salvamento bem-sucedido
    } else {
        console.error('Erro ao salvar o estudante no banco de dados');
    }
}


// Função para gerenciar o estudante
function gerenciarEstudante(id) {
    var opcoesModals = document.querySelectorAll('.opcoesModal');
    opcoesModals.forEach(item => {
        item.style.display = "none";
    });
    const opcoesModal = document.querySelector(`#opcoesModal${id}`);
    if (opcoesModal) {
        opcoesModal.style.display = "block";
    }
}

// Função para fechar o modal de opções
function fecharOpcoes() {
    const opcoesModals = document.querySelectorAll('.opcoesModal');
    opcoesModals.forEach(item => {
        item.style.display = "none";
    });
}

// Função para abrir o modal de confirmação de exclusão
function abrirDeletar(id) {
    idParaDeletar = id; // Armazena o ID da linha a ser deletada
    var modal = document.getElementById('overlay1');
    modal.style.display = "flex";
}

// Função para deletar o estudante
document.getElementById('deleteBtn').addEventListener('click', function() {
    if (idParaDeletar !== null) {
        const linha = document.getElementById(`aluno-${idParaDeletar}`);
        if (linha) {
            linha.remove(); // Remove a linha da tabela
        }
        fecharModalDeletar(); // Fecha o modal de confirmação
    }
});

// Função para fechar o modal de deletar
function fecharModalDeletar() {
    var modal = document.getElementById('overlay1');
    modal.style.display = "none";
    idParaDeletar = null; // Limpa o ID armazenado
}

document.getElementById('cancelBtn').addEventListener('click', function(){
    fecharModalDeletar(); // Reutiliza a função para fechar
});

// Função para editar o estudante

function editarEstudante(id) {
    idParaEditar = id; // Armazena o ID da linha a ser editada
    const linha = document.getElementById(`aluno-${id}`);
    if (linha) {
        const nome = linha.children[1].innerText;
        const turma = linha.children[3].innerText;
        const telefone = linha.children[4].innerText;
        const endereco = linha.children[5].innerText;
        const avatarSrc = linha.children[0].querySelector('img').src;

        // Preencher o modal com os valores atuais
        document.getElementById('nomeEdit').value = nome;
        document.getElementById('turmaEdit').value = turma;
        document.getElementById('telefoneEdit').value = telefone;
        document.getElementById('enderecoEdit').value = endereco;

        // Verifica se o elemento fotoEditPreview existe antes de alterar o src
        const fotoEditPreview = document.getElementById('fotoEditPreview');
        if (fotoEditPreview) {
            fotoEditPreview.src = avatarSrc; // Mostra a imagem atual do estudante
        }

        // Abrir modal de edição
        document.getElementById('overlay3').style.display = 'block';
    }
}


// Função para salvar a edição do estudante
function salvarEdicao() {
    if (idParaEditar !== null) {
        const linha = document.getElementById(`aluno-${idParaEditar}`);
        if (linha) {
            // Atualizar os valores da linha com os novos valores do modal
            linha.children[1].innerText = document.getElementById('nomeEdit').value;
            linha.children[3].innerText = document.getElementById('turmaEdit').value;
            linha.children[4].innerText = document.getElementById('telefoneEdit').value;
            linha.children[5].innerText = document.getElementById('enderecoEdit').value;

            // Atualizar a foto se houver uma nova selecionada
            const fotoEdit = document.getElementById('fotoEdit').files[0]; // Pega o arquivo de imagem
            if (fotoEdit) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    linha.children[0].querySelector('img').src = e.target.result; // Atualiza a imagem do avatar
                };
                reader.readAsDataURL(fotoEdit); // Converte o arquivo de imagem para URL
            }
        }
        fecharModalEdicao(); // Fecha o modal após a edição
    }
}


// Função para fechar o modal de edição
function fecharModalEdicao() {
    document.getElementById('overlay3').style.display = 'none';
    idParaEditar = null; // Limpar o ID armazenado
}
// Função para arquivar o estudante
// Função para buscar estudantes e adicionar à tabela
var paginaAtual = 1;
const limitePorPagina = 10; // Número de estudantes por página
let totalPaginas = 0; // Variável para armazenar o total de páginas
const setaEsquerda = document.getElementById('prevPage');
const setaDireita = document.getElementById('nextPage');

async function carregarEstudantes(paginaAtual) {
    try {
        const response = await fetch(`http://localhost:4000/users?role=STUDENT&page=${paginaAtual}&limit=${limitePorPagina}`);
        const data = await response.json();

        if (data.users && data.users.length > 0) {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = ''; // Limpa a tabela antes de adicionar novos estudantes

            // Atualiza o total de páginas se houver informações na resposta
            totalPaginas = Math.ceil(data.total / limitePorPagina); // Supondo que 'data.total' seja o total de estudantes

            data.users.forEach((user, index) => {
                const estudanteIndex = (paginaAtual - 1) * limitePorPagina + index + 1; // Calcula o número do estudante
                const idEstudante = "ES" + estudanteIndex.toString().padStart(3, '0'); // Gera o ID no formato ES001, ES002, etc.

                const novoAluno = `
                    <tr id="aluno-${idEstudante}">
                        <td><div class="bola"></div></td>
                        <td>${user.name}</td>
                        <td>${idEstudante}</td>
                        <td>${user.phone}</td>
                        <td>${user.email}</td>
                        <td>
                            <button onclick="gerenciarEstudante('${idEstudante}')">Gerenciar</button>
                            <div class="opcoesModal" id="opcoesModal${idEstudante}">
                                <img class="x-simbolo" src="../icons/x-simbolo.png" onclick="fecharOpcoes()">
                                <p class="opcao editar" onclick="editarEstudante('${idEstudante}')">Editar</p>
                                <p class="opcao perfil" onclick="verPerfil('${idEstudante}')">Perfil</p>
                                <p class="opcao arquivar" onclick="arquivarEstudante('${idEstudante}')">Arquivar</p>
                                <p class="opcao deletar" onclick="abrirDeletar('${idEstudante}')">Deletar</p>
                            </div>
                        </td>
                    </tr>`;

                tbody.innerHTML += novoAluno;
            });

            // Verificar se deve mostrar ou esconder as setas
        } else {
            console.error('Nenhum estudante encontrado nesta página.');
        }
    } catch (error) {
        console.error('Erro ao carregar estudantes:', error);
    }
}


// Função para carregar a próxima página
function proximaPagina() {
    console.log(totalPaginas);
    paginaAtual += 1;
    if (paginaAtual==totalPaginas){
        setaDireita.style.display = 'none';
        setaEsquerda.style.display = 'flex';
    }
    document.getElementById('currentPage').textContent = paginaAtual;
    carregarEstudantes(paginaAtual);
}

// Função para carregar a página anterior
function paginaAnterior() {
    paginaAtual -= 1;
    if (paginaAtual>=1){
        setaDireita.style.display = 'flex';
        setaEsquerda.style.display = 'none';
    }
    document.getElementById('currentPage').textContent = paginaAtual;
    carregarEstudantes(paginaAtual);
}

// Chamar a função de carregar estudantes ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    carregarEstudantes(paginaAtual);
});
let turmaIdMap = {}; // Dicionário para armazenar a associação entre code e id

async function preencherDataList() {
    let paginaAtual = 1;
    let totalPaginas = 1;

    try {
        while (paginaAtual <= totalPaginas) {
            const response = await fetch(`http://localhost:4000/classes?page=${paginaAtual}&limit=10`);
            const data = await response.json();

            if (data.classes && data.classes.length > 0) {
                totalPaginas = Math.ceil(data.total / 10);

                data.classes.forEach(turma => {
                    // Preenche o dicionário associando code ao id
                    turmaIdMap[turma.code] = turma.id;

                    // Adiciona o code ao dataList para autocomplete no campo de seleção
                    const option = document.createElement('option');
                    option.value = turma.code;
                    dataList.appendChild(option);
                });
            }

            paginaAtual++; // Próxima página
        }
    } catch (error) {
        console.error('Erro ao carregar as turmas:', error);
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', preencherDataList);


// Chamar a função ao carregar a página
document.addEventListener('DOMContentLoaded', preencherDataList);
