import { checkEnv, sendError, supabaseRequest } from './database.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' });
  if (!checkEnv(res)) return;

  try {
    const tarefas = await supabaseRequest('tarefas?select=*&order=id.desc');
    return res.status(200).json(tarefas);
  } catch (error) {
    return sendError(res, error);
  }
}
