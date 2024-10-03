// Pegar os elementos necessários
const editIcon = document.querySelector('.edit-icon');
const imageInput = document.querySelector('#image-input');
const profileImg = document.querySelector('#profile-img');

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
function validarTelefone(phone) {
    const phoneRegEx = /^\(\d{2}\) \d{4,5}-\d{4}$/; // Formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    return phoneRegEx.test(phone);
}

// Função para validar o formulário
function validarFormulario() {
    let formValido = true;

    // Validação para o campo telefone
    const phoneInput = document.querySelector('#phone');
    if (!validarTelefone(phoneInput.value)) {
        formValido = false;
        phoneInput.style.border = "2px solid red";
        alert('Telefone inválido. Use o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.');
    } else {
        phoneInput.style.border = "1px solid #ccc";
    }

    // Validação para o campo turma

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
const closeBtn = document.querySelector('.close-btn');
closeBtn.addEventListener('click', () => {
    permissoesModal.style.display = 'none';
});
