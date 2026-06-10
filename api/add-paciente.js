import { checkEnv, sendError, supabaseRequest } from './database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!checkEnv(res)) return;

  const { nome, telefone, email } = req.body || {};

  if (!nome || !telefone) {
    return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
  }

  try {
    await supabaseRequest('pacientes', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ nome, telefone, email: email || null })
    });

    return res.status(200).json({ success: true, message: 'Paciente cadastrado com sucesso.' });
  } catch (error) {
    return sendError(res, error);
  }
}
