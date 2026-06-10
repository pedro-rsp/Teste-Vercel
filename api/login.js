import { checkEnv, sendError, supabaseRequest } from './database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  if (!checkEnv(res)) return;

  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const emailLimpo = String(email).trim().toLowerCase();
    const senhaLimpa = String(senha).trim();

    const usuarios = await supabaseRequest(
      `usuarios?email=eq.${encodeURIComponent(emailLimpo)}&select=id,nome,email,senha,perfil&limit=1`
    );

    const usuario = Array.isArray(usuarios) ? usuarios[0] : null;

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    if (String(usuario.senha).trim() !== senhaLimpa) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso.',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    return sendError(res, error);
  }
}
