// Sistema de Autenticação
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupAuthListener();
    }

    setupAuthListener() {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                console.log('Usuário logado:', session.user);
                this.handleSignIn(session.user);
            } else if (event === 'SIGNED_OUT') {
                console.log('Usuário deslogado');
                this.handleSignOut();
            }
        });
    }

    handleSignIn(user) {
        // Salvar dados do usuário no localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Atualizar UI
        this.updateUI(true, user);

        // Redirecionar se necessário
        if (window.location.pathname.includes('login')) {
            window.location.href = '/';
        }
    }

    handleSignOut() {
        // Limpar dados do usuário
        localStorage.removeItem('user');

        // Atualizar UI
        this.updateUI(false);

        // Redirecionar para home
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
    }

    updateUI(isLoggedIn, user = null) {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');

        if (isLoggedIn && user) {
            // Usuário logado
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';

            // Criar menu do usuário
            this.createUserMenu(user);
        } else {
            // Usuário não logado
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (signupBtn) signupBtn.style.display = 'inline-block';

            // Remover menu do usuário
            const userMenu = document.querySelector('.user-menu');
            if (userMenu) userMenu.remove();
        }
    }

    createUserMenu(user) {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <div class="user-info">
                <span class="user-name">${user.user_metadata?.name || 'Usuário'}</span>
                <span class="user-email">${user.email}</span>
            </div>
            <div class="user-actions">
                <button class="btn btn-secondary btn-sm" onclick="authManager.showProfile()">Perfil</button>
                <button class="btn btn-secondary btn-sm" onclick="authManager.logout()">Sair</button>
            </div>
        `;

        navActions.appendChild(userMenu);
    }

    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            return { success: true, user: data.user };
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: error.message };
        }
    }

    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;

            return { success: true, user: data.user };
        } catch (error) {
            console.error('Erro no cadastro:', error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Erro no logout:', error);
            return { success: false, error: error.message };
        }
    }

    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Erro ao resetar senha:', error);
            return { success: false, error: error.message };
        }
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }

    showProfile() {
        const user = this.getCurrentUser();
        if (!user) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2>Perfil do Usuário</h2>
                <div class="profile-info">
                    <div class="profile-field">
                        <label>Nome:</label>
                        <span>${user.user_metadata?.name || 'Não informado'}</span>
                    </div>
                    <div class="profile-field">
                        <label>Email:</label>
                        <span>${user.email}</span>
                    </div>
                    <div class="profile-field">
                        <label>Data de cadastro:</label>
                        <span>${new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="btn btn-primary" onclick="authManager.showPasswordReset()">Alterar Senha</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showPasswordReset() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2>Alterar Senha</h2>
                <form class="password-reset-form">
                    <div class="form-group">
                        <input type="email" id="resetEmail" placeholder="Digite seu email" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar Link de Reset</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        const form = modal.querySelector('.password-reset-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.querySelector('#resetEmail').value;

            const result = await this.resetPassword(email);
            if (result.success) {
                alert('Link de reset enviado para seu email!');
                modal.remove();
            } else {
                alert('Erro ao enviar link de reset: ' + result.error);
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Inicializar gerenciador de autenticação
const authManager = new AuthManager();
