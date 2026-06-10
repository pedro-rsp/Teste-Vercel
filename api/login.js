const form = document.getElementById('loginForm');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  mensagem.textContent = 'Entrando...';
  mensagem.className = 'mensagem';

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      mensagem.textContent = data.error || 'Erro ao fazer login.';
      mensagem.className = 'mensagem erro';
      return;
    }

    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    mensagem.textContent = 'Login realizado com sucesso!';
    mensagem.className = 'mensagem sucesso';

    setTimeout(() => {
      window.location.href = '/pacientes.html';
    }, 800);

  } catch (error) {
    console.error(error);
    mensagem.textContent = 'Erro de conexão com o servidor.';
    mensagem.className = 'mensagem erro';
  }
});