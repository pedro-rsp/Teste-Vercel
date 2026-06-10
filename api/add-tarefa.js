import { checkEnv, sendError, supabaseRequest } from './database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!checkEnv(res)) return;

  const { titulo, descricao } = req.body || {};

  if (!titulo) {
    return res.status(400).json({ error: 'Título é obrigatório.' });
  }

  try {
    await supabaseRequest('tarefas', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ titulo, descricao: descricao || null, concluida: false })
    });

    return res.status(200).json({ success: true, message: 'Tarefa cadastrada com sucesso.' });
  } catch (error) {
    return sendError(res, error);
  }
}
