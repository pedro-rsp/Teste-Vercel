export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

export function checkEnv(res) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    res.status(500).json({
      error: 'Variáveis SUPABASE_URL e SUPABASE_KEY não configuradas na Vercel.'
    });
    return false;
  }
  return true;
}

export async function supabaseRequest(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || data?.error || 'Erro na comunicação com o Supabase.';
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

export function sendError(res, error) {
  return res.status(error.status || 500).json({
    error: error.message || 'Erro interno no servidor.',
    details: error.details || undefined
  });
}
