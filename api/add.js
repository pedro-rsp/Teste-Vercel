import { SUPABASE_URL, SUPABASE_KEY } from './database.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { nome, celular, email } = req.body;

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                name: nome,
                phone: celular,
                email: email
            })
        });

        if (!response.ok) {
            const error = await response.text();
            return res.status(400).json({ error });
        }

        return res.status(200).json({ success: true });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}