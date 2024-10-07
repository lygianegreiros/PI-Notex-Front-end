const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const rememberCheckbox = document.getElementById('remember');
        const forgetPasswordBtn = document.getElementById('forgetPasswordBtn');
        const emailSuggestionBox = document.getElementById('autocomplete-email-list');
        const passwordSuggestionBox = document.getElementById('autocomplete-password-list');

        function saveCredentials() {
            const email = emailInput.value;
            const password = passwordInput.value;
            const remember = rememberCheckbox.checked;

            if (remember) {
                let credentials = JSON.parse(localStorage.getItem('credentials')) || [];
                const exists = credentials.some(cred => cred.email === email);
                if (!exists) {
                    credentials.push({ email, password });
                    localStorage.setItem('credentials', JSON.stringify(credentials));
                }
            }
        }

        function loadSuggestions() {
            const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
            const emails = credentials.map(cred => cred.email);
            const passwords = credentials.map(cred => cred.password);

            // Sugestões de e-mail
            emailInput.addEventListener('input', function() {
                showSuggestions(this.value, emails, emailSuggestionBox, emailInput);
            });

            // Sugestões de senha
            passwordInput.addEventListener('input', function() {
                showSuggestions(this.value, passwords, passwordSuggestionBox, passwordInput);
            });
        }

        function showSuggestions(value, suggestions, suggestionBox, input) {
            suggestionBox.innerHTML = '';

            if (!value) return;

            const filteredSuggestions = suggestions.filter(item => 
                item.toLowerCase().startsWith(value.toLowerCase())
            );

            filteredSuggestions.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('autocomplete-suggestion');
                div.textContent = item;

                // Criando o botão de remoção "X"
                const removeBtn = document.createElement('span');
                removeBtn.textContent = '✖';
                removeBtn.classList.add('remove-suggestion');
                removeBtn.onclick = (e) => {
                    e.stopPropagation(); // Evita que o click propague para o evento de clique do suggestion
                    removeCredential(item, suggestions, suggestionBox);
                };

                div.appendChild(removeBtn);
                div.onclick = () => {
                    input.value = item;
                    suggestionBox.innerHTML = ''; // Limpa as sugestões
                    checkIfForgetPasswordShouldAppear(item);
                };
                suggestionBox.appendChild(div);
            });
        }

        function removeCredential(item, suggestions, suggestionBox) {
            let credentials = JSON.parse(localStorage.getItem('credentials')) || [];
            credentials = credentials.filter(cred => cred.email !== item);
            localStorage.setItem('credentials', JSON.stringify(credentials));
            alert('Credencial removida: ' + item);
            loadSuggestions(); // Recarrega as sugestões após a remoção
        }

        // Exibe o botão de esquecer senha se a senha estiver salva
        function checkIfForgetPasswordShouldAppear(email) {
            const credentials = JSON.parse(localStorage.getItem('credentials')) || [];
            const user = credentials.find(cred => cred.email === email);
            if (user) {
                forgetPasswordBtn.style.display = 'block';
                forgetPasswordBtn.onclick = function() {
                    forgetPassword(email);
                };
            } else {
                forgetPasswordBtn.style.display = 'none';
            }
        }

        function forgetPassword(email) {
            let credentials = JSON.parse(localStorage.getItem('credentials')) || [];
            credentials = credentials.filter(cred => cred.email !== email);
            localStorage.setItem('credentials', JSON.stringify(credentials));
            alert('A senha foi esquecida para o e-mail ' + email);
            forgetPasswordBtn.style.display = 'none';
            emailInput.value = '';
            passwordInput.value = '';
            emailInput.autocomplete='';
            passwordInput.autocomplete='';
        }

        // Carrega sugestões ao carregar a página
        window.onload = function() {
            loadSuggestions();
        };

        // Salvar credenciais ao enviar o formulário
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Evita o envio do formulário para fins de demonstração
            saveCredentials();
            alert('Login realizado com sucesso!');
        });

        // Fecha as sugestões ao clicar fora
        document.addEventListener('click', function (e) {
            if (!e.target.closest('#email')) {
                emailSuggestionBox.innerHTML = '';
            }
            if (!e.target.closest('#password')) {
                passwordSuggestionBox.innerHTML = '';
            }
        });