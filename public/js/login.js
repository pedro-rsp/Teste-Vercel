const formLogin = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');

if (localStorage.getItem('usuarioClinica')) {
  window.location.href = '/pacientes.html';
}

formLogin.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  mensagem.textContent = '';
  mensagem.className = 'msg';

  if (!email || !senha) {
    mensagem.textContent = 'Preencha e-mail e senha.';
    mensagem.classList.add('error');
    return;
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      mensagem.textContent = data.error || 'Erro ao fazer login.';
      mensagem.classList.add('error');
      return;
    }

    localStorage.setItem('usuarioClinica', JSON.stringify(data.usuario));
    window.location.href = '/pacientes.html';
  } catch {
    mensagem.textContent = 'Erro de conexão com o servidor.';
    mensagem.classList.add('error');
  }
});
