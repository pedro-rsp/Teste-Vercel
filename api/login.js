import { checkEnv, sendError, supabaseRequest } from './database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  if (!checkEnv(res)) return;

  try {
    const { email, senha } = req.body || {};
    const emailNormalizado = String(email || '').trim().toLowerCase();
    const senhaDigitada = String(senha || '').trim();

    if (!emailNormalizado || !senhaDigitada) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    // Busca por e-mail. O select limitado evita trazer campos desnecessários.
    let usuarios = await supabaseRequest(
      `usuarios?select=id,nome,email,senha,perfil&email=eq.${encodeURIComponent(emailNormalizado)}&limit=1`
    );

    // Segunda tentativa: caso o e-mail no banco esteja com letras maiúsculas.
    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      usuarios = await supabaseRequest(
        `usuarios?select=id,nome,email,senha,perfil&email=ilike.${encodeURIComponent(emailNormalizado)}&limit=1`
      );
    }

    const usuario = Array.isArray(usuarios) ? usuarios[0] : null;

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    if (String(usuario.senha || '').trim() !== senhaDigitada) {
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
