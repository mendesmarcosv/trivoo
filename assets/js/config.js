// Configuração do Supabase
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Configurações da aplicação
const CONFIG = {
    supabase: {
        url: SUPABASE_URL,
        anonKey: SUPABASE_ANON_KEY
    },
    app: {
        name: 'Trivoo',
        version: '1.0.0'
    }
};

// Exportar configurações
window.CONFIG = CONFIG;
window.supabase = supabase;
