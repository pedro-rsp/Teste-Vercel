import { checkEnv, sendError, supabaseRequest } from './database.js';

const STATUS_VALIDOS = ['Confirmada', 'Pendente', 'Cancelada'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!checkEnv(res)) return;

  const { paciente_id, data, hora, status } = req.body || {};

  if (!paciente_id || !data || !hora || !status) {
    return res.status(400).json({ error: 'Paciente, data, hora e status são obrigatórios.' });
  }

  if (!STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }

  try {
    await supabaseRequest('agendamentos', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ paciente_id: Number(paciente_id), data, hora, status })
    });

    return res.status(200).json({ success: true, message: 'Agendamento cadastrado com sucesso.' });
  } catch (error) {
    return sendError(res, error);
  }
}
