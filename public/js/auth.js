function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem('usuarioClinica') || 'null');
  } catch {
    return null;
  }
}

function protegerPagina() {
  const usuario = getUsuario();
  if (!usuario) {
    window.location.href = '/index.html';
    return null;
  }

  const span = document.getElementById('usuarioLogado');
  if (span) span.textContent = `Olá, ${usuario.nome || usuario.email}`;
  return usuario;
}

function sair() {
  localStorage.removeItem('usuarioClinica');
  window.location.href = '/index.html';
}
