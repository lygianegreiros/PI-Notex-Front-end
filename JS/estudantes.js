id=0;
function abrirModal() {
    document.getElementById('overlay').style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('overlay').style.display = 'none';
}

// Função para salvar os dados do estudante
function salvarEstudante() {
    const nome = document.getElementById('nome').value;
    id=id+1;
    const turma = document.getElementById('turma').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;

    const tbody = document.querySelector('tbody');
    const novoAluno = `
        <tr>
            <td><div class="bola"></div></td>
            <td>${nome}</td>
            <td>${"ES"+id.toString().padStart(4, '0')}</td>
            <td>${turma}</td>
            <td>${telefone}</td>
            <td>${endereco}</td>
            <td><button>Acessar perfil</button></td>
        </tr>`;
    tbody.innerHTML += novoAluno;

    fecharModal();  // Fecha o modal após adicionar o estudante
}