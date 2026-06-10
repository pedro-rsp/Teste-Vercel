const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');

if (!usuario) {
  window.location.href = '/';
}

const usuarioLogado = document.getElementById('usuarioLogado');
if (usuarioLogado && usuario) {
  usuarioLogado.textContent = `Olá, ${usuario.nome || usuario.email}`;
}

function sair() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = '/';
}
