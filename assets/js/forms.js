// Gerenciamento de Formulários
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupValidation();
        this.setupMasks();
    }

    setupValidation() {
        // Validação em tempo real
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea')) {
                this.validateField(e.target);
            }
        });

        // Validação ao perder foco
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, textarea')) {
                this.validateField(e.target);
            }
        }, true);
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Remover mensagens de erro anteriores
        this.clearFieldError(field);

        // Validações específicas por tipo
        switch (field.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Email inválido';
                }
                break;
            case 'password':
                if (value && value.length < 6) {
                    isValid = false;
                    errorMessage = 'A senha deve ter pelo menos 6 caracteres';
                }
                break;
            default:
                if (field.hasAttribute('required') && !value) {
                    isValid = false;
                    errorMessage = 'Este campo é obrigatório';
                }
                break;
        }

        // Validações por nome do campo
        if (fieldName === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Nome deve ter pelo menos 2 caracteres';
        }

        if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('error');

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;

        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');

        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setupMasks() {
        // Máscara para telefone (se necessário)
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="tel"]')) {
                this.maskPhone(e.target);
            }
        });
    }

    maskPhone(field) {
        let value = field.value.replace(/\D/g, '');

        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length <= 10) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
            } else {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            }
        }

        field.value = value;
    }

    async submitForm(formId, customValidation = null) {
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`Formulário ${formId} não encontrado`);
            return { success: false, error: 'Formulário não encontrado' };
        }

        // Validar todos os campos
        const fields = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        // Validação customizada
        if (customValidation && typeof customValidation === 'function') {
            if (!customValidation()) {
                isFormValid = false;
            }
        }

        if (!isFormValid) {
            return { success: false, error: 'Formulário contém erros de validação' };
        }

        // Coletar dados do formulário
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        return { success: true, data: data };
    }

    showFormSuccess(form, message = 'Dados enviados com sucesso!') {
        this.showFormMessage(form, message, 'success');
    }

    showFormError(form, message = 'Erro ao enviar dados. Tente novamente.') {
        this.showFormMessage(form, message, 'error');
    }

    showFormMessage(form, message, type) {
        // Remover mensagens anteriores
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;

        form.appendChild(messageElement);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }

    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();

            // Limpar mensagens de erro
            form.querySelectorAll('.field-error').forEach(error => error.remove());
            form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
            form.querySelectorAll('.form-message').forEach(message => message.remove());
        }
    }

    disableForm(formId, disabled = true) {
        const form = document.getElementById(formId);
        if (form) {
            const fields = form.querySelectorAll('input, textarea, select, button');
            fields.forEach(field => {
                field.disabled = disabled;
            });

            if (disabled) {
                form.style.opacity = '0.6';
                form.style.pointerEvents = 'none';
            } else {
                form.style.opacity = '1';
                form.style.pointerEvents = 'auto';
            }
        }
    }
}

// Estilos CSS para validação
const validationStyles = `
<style>
input.error, textarea.error, select.error {
    border-color: #e74c3c !important;
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
}

.field-error {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

.form-message {
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    font-weight: 500;
}

.form-message-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.form-message-error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.form-message-info {
    background-color: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
}
</style>
`;

// Inserir estilos no head
document.head.insertAdjacentHTML('beforeend', validationStyles);

// Inicializar gerenciador de formulários
const formManager = new FormManager();
