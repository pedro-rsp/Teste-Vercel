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

  if (!response.ok) throw new Error(pacientes.error || 'Erro ao carregar pacientes.');

  selectPaciente.innerHTML = '<option value="">Selecione um paciente</option>' +
    pacientes.map((paciente) => `<option value="${paciente.id}">${paciente.nome}</option>`).join('');
}

async function carregarAgenda() {
  try {
    const response = await fetch('/api/listar-agenda');
    const agendamentos = await response.json();

    if (!response.ok) throw new Error(agendamentos.error || 'Erro ao carregar agenda.');

    tabelaAgenda.innerHTML = agendamentos.length
      ? agendamentos.map((item) => {
          const statusClass = String(item.status || '').toLowerCase();
          return `
            <tr>
              <td>${item.id}</td>
              <td>${item.paciente?.nome || '-'}</td>
              <td>${item.data || '-'}</td>
              <td>${item.hora || '-'}</td>
              <td><span class="badge ${statusClass}">${item.status || '-'}</span></td>
            </tr>
          `;
        }).join('')
      : '<tr><td colspan="5">Nenhum agendamento cadastrado.</td></tr>';
  } catch (error) {
    console.error(error);
    mostrarMensagem(error.message, 'error');
  }
}

formAgenda.addEventListener('submit', async (event) => {
  event.preventDefault();
  mostrarMensagem('Salvando agendamento...');

  const dados = {
    paciente_id: selectPaciente.value,
    data: document.getElementById('data').value,
    hora: document.getElementById('hora').value,
    status: document.getElementById('status').value
  };

  try {
    const response = await fetch('/api/add-agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar agendamento.');

    formAgenda.reset();
    mostrarMensagem(data.message || 'Agendamento cadastrado com sucesso.', 'success');
    await carregarAgenda();
  } catch (error) {
    console.error(error);
    mostrarMensagem(error.message, 'error');
  }
});

(async function iniciar() {
  try {
    await carregarPacientesSelect();
    await carregarAgenda();
  } catch (error) {
    console.error(error);
    mostrarMensagem(error.message, 'error');
  }
})();
