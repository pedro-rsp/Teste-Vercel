const usuarioSalvo = localStorage.getItem('usuario');
const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

if (!usuario) {
  window.location.href = '/index.html';
}

const usuarioLogado = document.getElementById('usuarioLogado');
if (usuarioLogado && usuario) {
  usuarioLogado.textContent = `Olá, ${usuario.nome || usuario.email}`;
}

function sair() {
  localStorage.removeItem('usuario');
  window.location.href = '/index.html';
}
