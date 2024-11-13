// Elementos de exibição do cartão
const cardNumberDisplay = document.querySelector('.card-number-display');
const cardholderDisplay = document.querySelector('.cardholder-display');
const expiryDisplay = document.querySelector('.expiry-display');
const cvcDisplay = document.querySelector('.cvc-display');

// Elementos do formulário
const form = document.getElementById('card-form');
const cardholderInput = document.getElementById('cardholder');
const cardNumberInput = document.getElementById('cardnumber');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const cvcInput = document.getElementById('cvc');

// Formatar o número do cartão conforme o usuário digita
cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.substr(0, 16);
    const parts = value.match(/.{1,4}/g) || [];
    e.target.value = parts.join(' ');
    cardNumberDisplay.textContent = e.target.value || '0000 0000 0000 0000';
});

// Atualizar a exibição do titular do cartão conforme o usuário digita
cardholderInput.addEventListener('input', (e) => {
    // Remove números do campo de nome do titular
    e.target.value = e.target.value.replace(/[0-9]/g, '');
    cardholderDisplay.textContent = e.target.value || 'Jane Appleseed';
});

monthInput.addEventListener('input', updateExpiry);
yearInput.addEventListener('input', updateExpiry);

function updateExpiry() {
    const month = monthInput.value.padStart(2, '0');
    const year = yearInput.value.padStart(2, '0');
    expiryDisplay.textContent = `${month}/${year}`;
}

cvcInput.addEventListener('input', (e) => {
    cvcDisplay.textContent = e.target.value || '000';
});

// Validação do formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Remover mensagens de erro anteriores
    clearErrors();

    // Validar nome do titular do cartão
    if (!cardholderInput.value.trim()) {
        showError(cardholderInput, "Can't be blank");
        isValid = false;
    }

    // Validar número do cartão
    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    if (!cardNumber) {
        showError(cardNumberInput, "Can't be blank");
        isValid = false;
    } else if (!/^\d{16}$/.test(cardNumber)) {
        showError(cardNumberInput, "Wrong format, numbers only");
        isValid = false;
    }

    // Validar mês
    const monthValue = parseInt(monthInput.value);
    if (!monthInput.value) {
        showError(monthInput, "Can't be blank");
        isValid = false;
    } else if (monthValue < 1 || monthValue > 12) {
        showError(monthInput, "Invalid month");
        isValid = false;
    }

    // Validar ano
    if (!yearInput.value) {
        showError(yearInput, "Can't be blank");
        isValid = false;
    }

    // Validar CVC
    if (!cvcInput.value) {
        showError(cvcInput, "Can't be blank");
        isValid = false;
    } else if (!/^\d{3}$/.test(cvcInput.value)) {
        showError(cvcInput, "Invalid CVC");
        isValid = false;
    }

    if (isValid) {
        showCompleteState();
    }
});

// Impedir letras na entrada de data (mês e ano) em um único bloco
[monthInput, yearInput].forEach(input => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, ''); // Remove qualquer coisa que não seja número
        updateExpiry(); // Atualiza a exibição de data
    });
});

// Função para exibir mensagens de erro
function showError(input, message) {
    input.classList.add('error');
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Função para limpar as mensagens de erro
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.style.display = 'none');

    const inputs = document.querySelectorAll('.error');
    inputs.forEach(input => input.classList.remove('error'));
}

// Remover erro quando o usuário começa a digitar ou corrigir
const inputs = [cardholderInput, cardNumberInput, monthInput, yearInput, cvcInput];
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim()) {
            input.classList.remove('error');
            const errorElement = input.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.style.display = 'none';
            }
        }
    });
});

// Exibir estado de conclusão
function showCompleteState() {
    form.style.display = 'none';
    document.querySelector('.complete-state').style.display = 'block';
}

// Reiniciar o formulário para um novo preenchimento
function resetForm() {
    form.reset();
    form.style.display = 'block';
    document.querySelector('.complete-state').style.display = 'none';
    cardNumberDisplay.textContent = '0000 0000 0000 0000';
    cardholderDisplay.textContent = 'Jane Appleseed';
    expiryDisplay.textContent = '00/00';
    cvcDisplay.textContent = '000';
}
