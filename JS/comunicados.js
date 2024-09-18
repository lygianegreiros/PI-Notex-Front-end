function abrirModal() {
    document.getElementById('overlay').style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('overlay').style.display = 'none';
}
// Cria um objeto Intl.DateTimeFormat para formatar o mês e o dia

var formatterMes = new Intl.DateTimeFormat('pt-BR', {
    month: 'long'
});

// Obtém a data atual e a formata

const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
const data = new Intl.DateTimeFormat('pt-BR', opcoes).format(new Date());
console.log(data);
let comunicado={};
var c=0;
var f=0;
// Função para salvar os dados do estudante
function salvarComunicado() {
    const dataAtual2 = new Date();
    const diaFormatado = dataAtual2.getDate();
    const mesFormatado = (formatterMes.format(dataAtual2)).charAt(0).toUpperCase() + (formatterMes.format(dataAtual2)).slice(1).toLowerCase();;
    const anoFormatado = dataAtual2.getFullYear();

    // Junta o mês e dia com o ano
    var dataHoje = `${mesFormatado} ${diaFormatado}, ${anoFormatado}`;

    // Exibe a data formatada no console
    console.log(dataHoje);
    c=c+1;  // Incrementa o conjunto corretamente
    const conjuntoDeComunicados=document.getElementById("comunicados-container");
    // Adiciona uma nova turma ao dicionário de turmas
    comunicado[c] = {
        titulo: titulo,
        descricaoComunicado: descricaoComunicado,
    };
    // Atualiza o conteúdo da página com a nova turma
    if(c%4==3){
        f=f+1;
        conjuntoDeComunicados.innerHTML+=`<div class="comunicado-flex" id="comunicado-flex${f}"></div>`;
        document.getElementById(`comunicado-flex${f}`).innerHTML+=
        `<div class="comunicadoClasse">
        <h2 class="tituloComunicado">${comunicado[c].titulo.value}</h2>
        <div class="dataComunicado"><p>${dataHoje}</p></div>
        <div class="eye-container"><img class="eye-img" src='../img/eye-outline 1.png'> <p class="eye-paragraph">1<p></div>
        <br>
        <p class="criadoPor">Criado por Leia O.</p>
        <br>
        <p class="descricaoDoComunicado">${comunicado[c].descricaoComunicado.value}</p>
    </div>
`;
    }
    else if(c%4==0){
        document.getElementById(`comunicado-flex${f}`).innerHTML+=
        `<div class="comunicadoClasse">
        <h2 class="tituloComunicado">${comunicado[c].titulo.value}</h2>
        <div class="dataComunicado"><p>${dataHoje}</p></div>
        <div class="eye-container"><img class="eye-img" src='../img/eye-outline 1.png'> <p class="eye-paragraph">1<p></div>
        <br>
        <p class="criadoPor">Criado por Leia O.</p>
        <br>
        <p class="c">${comunicado[c].descricaoComunicado.value}</p>
    </div>
`;
    }
    else{
        // Atualiza a turma existente com a série e classe passadas
        conjuntoDeComunicados.innerHTML += `
            <div class="comunicadoClasse" id="comunicadoClasse${c}">
                <h2 class="tituloComunicado">${comunicado[c].titulo.value}</h2>
                <div class="dataComunicado"><p>${dataHoje}</p></div>
                <div class="eye-container"><img class="eye-img" src='../img/eye-outline 1.png'> <p class="eye-paragraph">1<p></div>
                <br>
                <p class="criadoPor">Criado por Leia O.</p>
                <br>
                <p class="descricaoDoComunicado">${comunicado[c].descricaoComunicado.value}</p>
            </div>
        `;
    }
    fecharModal();  // Fecha o modal após adicionar o estudante
}