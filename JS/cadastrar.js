// Pegar os elementos necessários
const editIcon = document.querySelector('.edit-icon');
const imageInput = document.querySelector('#image-input');
const profileImg = document.querySelector('#image-input');

// Quando o ícone de edição for clicado, disparar o input de file
editIcon.addEventListener('click', () => {
    imageInput.click();
});

// Quando o usuário selecionar uma imagem
imageInput.addEventListener('change', function() {
    const file = this.files[0]; // Seleciona o primeiro arquivo (imagem)
    
    if (file) {
        const reader = new FileReader(); // Cria um FileReader para ler o arquivo
        
        reader.onload = function(event) {
            profileImg.src = event.target.result; // Atualiza o src da imagem de perfil com a nova imagem
        };
        
        reader.readAsDataURL(file); // Converte o arquivo de imagem para uma URL base64
    }
});
// Pegar os elementos do formulário e os modais
const cadastroForm = document.querySelector('#cadastro-form');
const permissoesModal = document.querySelector('#permissoes-modal');
const cadastroModal = document.querySelector('#cadastro-modal');
const inputs = cadastroForm.querySelectorAll('input');

// Função para validar o formulário
// Validações com RegEx

// Função para validar o formulário
function validarFormulario() {
    let formValido = true;

    // Validar os outros campos se estão vazios
    inputs.forEach(input => {
        if (input.value.trim() === "") {
            formValido = false;
            input.style.border = "2px solid red";
        } else {
            input.style.border = "1px solid #ccc";
        }
    });

    return formValido;
}

// Quando o formulário de cadastro for enviado
cadastroForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário

    // Verificar se o formulário é válido
    if (validarFormulario()) {
        cadastroModal.style.display = 'none'; // Esconder o modal de cadastro
        permissoesModal.style.display = 'block'; // Mostrar o modal de permissões
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
});

// Permitir que o usuário feche o modal de permissões

// Função para enviar os dados do formulário para o back-end
async function salvarProfessor(dadosProfessor) {
    console.log(dadosProfessor);
    try {
        const response = await fetch('http://localhost:4000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosProfessor),
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar o professor');
        }

        const data = await response.json();
        alert('Professor cadastrado com sucesso!');
        console.log(data);
    } catch (error) {
        alert(error.message);
    }
}

// Enviar dados do formulário para o backend após validação
cadastroForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Verificar se o formulário é válido
    if (validarFormulario()) {
        const dadosProfessor = {
            name: document.querySelector('#name').value,
            avatarUrl: profileImg.src, // URL da imagem
            email: document.querySelector('#email').value,
            password: document.querySelector('#password').value,
            role: 'TEACHER',
            phone: document.querySelector('#phone').value
        };

        salvarProfessor(dadosProfessor); // Chamar função para salvar no back-end
    }
});
