const editIcon = document.querySelector('.edit-icon');
const imageInput = document.querySelector('#image-input');
const profileImg = document.querySelector('#avatar');

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