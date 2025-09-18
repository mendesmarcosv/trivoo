// App principal
class TrivooApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupScrollEffects();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Botões de navegação
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }

        if (signupBtn) {
            signupBtn.addEventListener('click', () => this.showSignupModal());
        }

        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Formulário de contato
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }

    showLoginModal() {
        this.showModal('login');
    }

    showSignupModal() {
        this.showModal('signup');
    }

    showModal(type) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2>${type === 'login' ? 'Entrar' : 'Cadastrar'}</h2>
                <form class="auth-form" id="${type}Form">
                    ${type === 'signup' ? `
                        <div class="form-group">
                            <input type="text" id="name" placeholder="Nome completo" required>
                        </div>
                    ` : ''}
                    <div class="form-group">
                        <input type="email" id="email" placeholder="Email" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password" placeholder="Senha" required>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        ${type === 'login' ? 'Entrar' : 'Cadastrar'}
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Configurar form
        const form = modal.querySelector('.auth-form');
        form.addEventListener('submit', (e) => this.handleAuthSubmit(e, type));
    }

    async handleAuthSubmit(e, type) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            this.showLoading(e.target);

            if (type === 'login') {
                const { user, error } = await supabase.auth.signIn({
                    email: data.email,
                    password: data.password
                });

                if (error) throw error;

                this.showMessage('Login realizado com sucesso!', 'success');
                this.updateUIAfterAuth(user);
            } else {
                const { user, error } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            name: data.name
                        }
                    }
                });

                if (error) throw error;

                this.showMessage('Cadastro realizado! Verifique seu email.', 'success');
            }

            e.target.closest('.modal').remove();
        } catch (error) {
            console.error('Erro na autenticação:', error);
            this.showMessage(error.message, 'error');
        } finally {
            this.hideLoading(e.target);
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            this.showLoading(e.target);

            // Salvar no Supabase
            const { error } = await supabase
                .from('contacts')
                .insert([{
                    name: data.name,
                    email: data.email,
                    message: data.message,
                    created_at: new Date()
                }]);

            if (error) throw error;

            this.showMessage('Mensagem enviada com sucesso!', 'success');
            e.target.reset();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            this.showMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            this.hideLoading(e.target);
        }
    }

    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading"></div> Processando...';
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.textContent;
    }

    showMessage(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    async checkAuthStatus() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                this.updateUIAfterAuth(user);
            }
        } catch (error) {
            console.error('Erro ao verificar status de autenticação:', error);
        }
    }

    updateUIAfterAuth(user) {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');

        if (loginBtn && signupBtn) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';

            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <span>Olá, ${user.user_metadata?.name || user.email}</span>
                <button class="btn btn-secondary" onclick="app.logout()">Sair</button>
            `;

            document.querySelector('.nav-actions').appendChild(userMenu);
        }
    }

    async logout() {
        try {
            await supabase.auth.signOut();
            location.reload();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    }

    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .about, .contact').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupAnimations() {
        // Adicionar classe de animação ao carregar
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('loaded');
        });
    }
}

// Inicializar aplicação
const app = new TrivooApp();
