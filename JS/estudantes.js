let idParaEditar = null;
let id = 0;
let idParaDeletar = null; // Variável para armazenar o ID do estudante a ser deletado

// Função para abrir o modal de adição
function abrirModal() {
    document.getElementById('overlay2').style.display = 'block';
}

// Função para fechar o modal de adição
function fecharModal() {
    document.getElementById('overlay2').style.display = 'none';
}

// Função para salvar os dados do estudante
async function salvarEstudante() {
    const nome = document.getElementById('nome').value;
    const turma = document.getElementById('turma').value;
    const telefone = document.getElementById('telefone').value;
    const foto = document.getElementById('foto').files[0]; // Para pegar o arquivo de imagem
    const cpf=document.getElementById('cpf').value;
    const senhaEstudante=document.getElementById('senhaEstudante').value;
    const email=document.getElementById('email').value;
    // Preparar os dados do estudante
    const estudanteData = new FormData();
    estudanteData.append('name', nome);
    estudanteData.append('phone', telefone);
    estudanteData.append('cpf', cpf);
    estudanteData.append('email', email);
    estudanteData.append('password', senhaEstudante);
    estudanteData.append('isActive', true);
    estudanteData.append('avatarUrl', foto);
    estudanteData.append('role', 'STUDENT');
    // Verifica se foi adicionada uma foto
    try {
        const response = await fetch('http://localhost:4000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estudanteData)
        });

        if (response.ok) {
            const novoEstudante = await response.json();
            // Adicionar o estudante na tabela
            id += 1; // Incrementa o ID único
            const tbody = document.querySelector('tbody');
            const novoAluno = `
                <tr id="aluno-${id}">
                    <td><img class="avatarEstudante" id="avatarEstudante${id}" src="https://via.placeholder.com/80"></td>
                    <td>${novoEstudante.nome}</td>
                    <td>${"ES" + id.toString().padStart(4, '0')}</td>
                    <td>${novoEstudante.turma}</td>
                    <td>${novoEstudante.telefone}</td>
                    <td>
                        <button onclick="gerenciarEstudante(${id})">Gerenciar</button>
                        <div class="opcoesModal" id="opcoesModal${id}">
                            <img class="x-simbolo" src="../icons/x-simbolo.png" onclick="fecharOpcoes()">
                            <p class="opcao editar" onclick="editarEstudante(${id})">Editar</p>
                            <p class="opcao perfil" onclick="verPerfil(${id})">Perfil</p>
                            <p class="opcao arquivar" onclick="arquivarEstudante(${id})">Arquivar</p>
                            <p class="opcao deletar" onclick="abrirDeletar(${id})">Deletar</p>
                        </div>
                    </td>
                </tr>`;

            tbody.innerHTML += novoAluno;

            // Atualizar a foto se houver uma
            if (foto) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById(`avatarEstudante${id}`).src = e.target.result;
                };
                reader.readAsDataURL(foto);
            }

            fecharModal(); // Fecha o modal após adicionar o estudante
        } else {
            console.error('Erro ao salvar o estudante no banco de dados');
        }
    } catch (error) {
        console.error('Erro ao salvar o estudante:', error);
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
async function carregarEstudantes() {
    try {
        const response = await fetch('http:localhost:4000/users?role=STUDENT'); // URL da API que retorna os estudantes
        const data = await response.json();

        if (data.users && data.users.length > 0) {
            const tbody = document.querySelector('tbody');

            data.users.forEach(user => {
                id += 1; // Incrementa o ID único
                const novoAluno = 
                    `<tr id="aluno-${id}">
                        <td><div class="bola"></div></td>
                        <td>${user.name}</td>
                        <td>${"ES" + id.toString().padStart(4, '0')}</td>
                        <td>${user.phone}</td>
                        <td>${user.email}</td>
                        <td>
                            <button onclick="gerenciarEstudante(${id})">Gerenciar</button>
                            <div class="opcoesModal" id="opcoesModal${id}">
                                <img class="x-simbolo" src="../icons/x-simbolo.png" onclick="fecharOpcoes()">
                                <p class="opcao editar" onclick="editarEstudante(${id})">Editar</p>
                                <p class="opcao perfil" onclick="verPerfil(${id})">Perfil</p>
                                <p class="opcao arquivar" onclick="arquivarEstudante(${id})">Arquivar</p>
                                <p class="opcao deletar" onclick="abrirDeletar(${id})">Deletar</p>
                            </div>
                        </td>
                    </tr>`;

                tbody.innerHTML += novoAluno;
            });
        }
    } catch (error) {
        console.error('Erro ao carregar estudantes:', error);
    }
}

// Chamar a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarEstudantes);
