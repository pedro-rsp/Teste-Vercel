const formPaciente = document.getElementById('formPaciente');
const tabelaPacientes = document.getElementById('tabelaPacientes');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo = '') {
  mensagem.textContent = texto;
  mensagem.className = `msg ${tipo}`.trim();
}

async function carregarPacientes() {
  try {
    const response = await fetch('/api/listar-pacientes');
    const pacientes = await response.json();

    if (!response.ok) throw new Error(pacientes.error || 'Erro ao carregar pacientes.');

    tabelaPacientes.innerHTML = pacientes.length
      ? pacientes.map((paciente) => `
          <tr>
            <td>${paciente.id}</td>
            <td>${paciente.nome || '-'}</td>
            <td>${paciente.telefone || '-'}</td>
            <td>${paciente.email || '-'}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="4">Nenhum paciente cadastrado.</td></tr>';
  } catch (error) {
    console.error(error);
    mostrarMensagem(error.message, 'error');
  }
}

formPaciente.addEventListener('submit', async (event) => {
  event.preventDefault();
  mostrarMensagem('Salvando paciente...');

  const dados = {
    nome: document.getElementById('nome').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    email: document.getElementById('email').value.trim()
  };

  try {
    const response = await fetch('/api/add-paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar paciente.');

    formPaciente.reset();
    mostrarMensagem(data.message || 'Paciente cadastrado com sucesso.', 'success');
    await carregarPacientes();
  } catch (error) {
    console.error(error);
    mostrarMensagem(error.message, 'error');
  }
});

carregarPacientes();
