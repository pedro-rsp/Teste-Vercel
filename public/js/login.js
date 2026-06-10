const formLogin = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo = '') {
  if (!mensagem) return;
  mensagem.textContent = texto;
  mensagem.className = `msg ${tipo}`.trim();
}

if (formLogin) {
  formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email')?.value.trim();
    const senha = document.getElementById('senha')?.value.trim();

    if (!email || !senha) {
      mostrarMensagem('Informe e-mail e senha.', 'error');
      return;
    }

    mostrarMensagem('Entrando...');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        mostrarMensagem(data.error || 'Erro ao fazer login.', 'error');
        return;
      }

      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      mostrarMensagem('Login realizado com sucesso! Redirecionando...', 'success');

      setTimeout(() => {
        window.location.href = '/pacientes.html';
      }, 500);
    } catch (error) {
      console.error('Erro no login:', error);
      mostrarMensagem('Erro de conexão com o servidor.', 'error');
    }
  });
}
