const formLogin = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo = '') {
  mensagem.textContent = texto;
  mensagem.className = `msg ${tipo}`.trim();
}

formLogin.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  mostrarMensagem('Entrando...', 'info');

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      mostrarMensagem(data.error || 'Não foi possível fazer login.', 'erro');
      return;
    }

    localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
    mostrarMensagem('Login realizado com sucesso! Redirecionando...', 'sucesso');

    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 500);
  } catch (error) {
    console.error('Erro no login:', error);
    mostrarMensagem('Erro de conexão com o servidor.', 'erro');
  }
});
