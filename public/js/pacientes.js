protegerPagina();

const formPaciente = document.getElementById('formPaciente');
const tabelaPacientes = document.getElementById('tabelaPacientes');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `msg ${tipo}`;
}

async function carregarPacientes() {
  tabelaPacientes.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';

  try {
    const response = await fetch('/api/listar-pacientes');
    const pacientes = await response.json();

    if (!response.ok) throw new Error(pacientes.error || 'Erro ao listar pacientes.');

    if (!pacientes.length) {
      tabelaPacientes.innerHTML = '<tr><td colspan="4">Nenhum paciente cadastrado.</td></tr>';
      return;
    }

    tabelaPacientes.innerHTML = pacientes.map((paciente) => `
      <tr>
        <td>${paciente.id}</td>
        <td>${paciente.nome || '-'}</td>
        <td>${paciente.telefone || '-'}</td>
        <td>${paciente.email || '-'}</td>
      </tr>
    `).join('');
  } catch (error) {
    tabelaPacientes.innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`;
  }
}

formPaciente.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!nome || !telefone) {
    mostrarMensagem('Preencha nome e telefone.', 'error');
    return;
  }

  try {
    const response = await fetch('/api/add-paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, telefone, email })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar paciente.');

    mostrarMensagem('Paciente cadastrado com sucesso!', 'success');
    formPaciente.reset();
    carregarPacientes();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
});

carregarPacientes();
