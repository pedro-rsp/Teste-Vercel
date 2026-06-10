import { checkEnv, sendError, supabaseRequest } from './database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!checkEnv(res)) return;

  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  try {
    const query = `usuarios?email=eq.${encodeURIComponent(email)}&senha=eq.${encodeURIComponent(senha)}&select=id,nome,email,perfil&limit=1`;
    const usuarios = await supabaseRequest(query);

    if (!usuarios || usuarios.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    return res.status(200).json({ success: true, usuario: usuarios[0] });
  } catch (error) {
    return sendError(res, error);
  }
}
