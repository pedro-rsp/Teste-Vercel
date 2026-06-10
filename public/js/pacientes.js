const formPaciente = document.getElementById('formPaciente');
const tabelaPacientes = document.getElementById('tabelaPacientes');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo = '') {
  mensagem.textContent = texto;
  mensagem.className = `msg ${tipo}`.trim();
}

async function carregarPacientes() {
  const response = await fetch('/api/listar-pacientes');
  const pacientes = await response.json();

  tabelaPacientes.innerHTML = '';

  if (!Array.isArray(pacientes) || pacientes.length === 0) {
    tabelaPacientes.innerHTML = '<tr><td colspan="4">Nenhum paciente cadastrado.</td></tr>';
    return;
  }

  pacientes.forEach((paciente) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${paciente.id}</td>
      <td>${paciente.nome || ''}</td>
      <td>${paciente.telefone || ''}</td>
      <td>${paciente.email || ''}</td>
    `;
    tabelaPacientes.appendChild(tr);
  });
}

formPaciente.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    nome: document.getElementById('nome').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    email: document.getElementById('email').value.trim()
  };

  try {
    const response = await fetch('/api/add-paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarMensagem(data.error || 'Erro ao cadastrar paciente.', 'erro');
      return;
    }

    formPaciente.reset();
    mostrarMensagem(data.message || 'Paciente cadastrado com sucesso.', 'sucesso');
    carregarPacientes();
  } catch (error) {
    mostrarMensagem('Erro de conexão com o servidor.', 'erro');
  }
});

carregarPacientes();
