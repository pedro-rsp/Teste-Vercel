import { SUPABASE_URL, SUPABASE_ANON_KEY } from './database.js';

export async function addPatient(nome, celular, email) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/pacientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ nome, celular, email })
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: 'Erro ao cadastrar paciente.' };
        }
    } catch (error) {
        return { success: false, error: 'Erro na conexão: ' + error.message };
    }
}