import { checkEnv, sendError, supabaseRequest } from './database.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' });
  if (!checkEnv(res)) return;

  try {
    const query = 'agendamentos?select=id,data,hora,status,paciente:pacientes(id,nome,email)&order=data.desc,hora.desc';
    const agendamentos = await supabaseRequest(query);
    return res.status(200).json(agendamentos);
  } catch (error) {
    return sendError(res, error);
  }
}
