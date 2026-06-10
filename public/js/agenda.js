const formAgenda = document.getElementById('formAgenda');
const selectPaciente = document.getElementById('paciente_id');
const tabelaAgenda = document.getElementById('tabelaAgenda');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo = '') {
  mensagem.textContent = texto;
  mensagem.className = `msg ${tipo}`.trim();
}

async function carregarPacientesSelect() {
  const response = await fetch('/api/listar-pacientes');
  const pacientes = await response.json();

  selectPaciente.innerHTML = '<option value="">Selecione um paciente</option>';
  if (Array.isArray(pacientes)) {
    pacientes.forEach((paciente) => {
      const option = document.createElement('option');
      option.value = paciente.id;
      option.textContent = paciente.nome;
      selectPaciente.appendChild(option);
    });
  }
}

async function carregarAgenda() {
  const response = await fetch('/api/listar-agenda');
  const agendamentos = await response.json();

  tabelaAgenda.innerHTML = '';

  if (!Array.isArray(agendamentos) || agendamentos.length === 0) {
    tabelaAgenda.innerHTML = '<tr><td colspan="5">Nenhum agendamento cadastrado.</td></tr>';
    return;
  }

  agendamentos.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.paciente?.nome || 'Paciente removido'}</td>
      <td>${item.data || ''}</td>
      <td>${item.hora || ''}</td>
      <td><span class="badge">${item.status || ''}</span></td>
    `;
    tabelaAgenda.appendChild(tr);
  });
}

formAgenda.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    paciente_id: selectPaciente.value,
    data: document.getElementById('data').value,
    hora: document.getElementById('hora').value,
    status: document.getElementById('status').value
  };

  try {
    const response = await fetch('/api/add-agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarMensagem(data.error || 'Erro ao cadastrar agendamento.', 'erro');
      return;
    }

    formAgenda.reset();
    mostrarMensagem(data.message || 'Agendamento cadastrado com sucesso.', 'sucesso');
    carregarAgenda();
  } catch (error) {
    mostrarMensagem('Erro de conexão com o servidor.', 'erro');
  }
});

carregarPacientesSelect();
carregarAgenda();
