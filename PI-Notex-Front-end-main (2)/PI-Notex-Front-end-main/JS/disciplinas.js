var id=0;
function abrirModal() {
    document.getElementById('overlay').style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('overlay').style.display = 'none';
}

// Função para salvar os dados do estudante
function salvarDisciplina() {
    var nome = document.getElementById('nome').value;
    id=id+1;
    var turma = document.getElementById('turma').value;
    var ch = document.getElementById('ch').value;
    var professor = document.getElementById('professor').value;

    const tbody = document.querySelector('tbody');
    var novaDisciplina = `
        <tr>
            <td>${"DC"+id.toString().padStart(4, '0')}</td>
            <td>${nome}</td>
            <td>${turma}</td>
            <td>${ch}</td>
            <td>${professor}</td>
            <td><button></button></td>
        </tr>`;
    tbody.innerHTML += novaDisciplina;

    fecharModal();  // Fecha o modal após adicionar o estudante
}