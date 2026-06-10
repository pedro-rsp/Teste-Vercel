protegerPagina();

const formAgenda = document.getElementById('formAgenda');
const selectPaciente = document.getElementById('paciente_id');
const tabelaAgenda = document.getElementById('tabelaAgenda');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `msg ${tipo}`;
}

function formatarData(dataISO) {
  if (!dataISO) return '-';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

async function carregarPacientes() {
  try {
    const response = await fetch('/api/listar-pacientes');
    const pacientes = await response.json();

    if (!response.ok) throw new Error(pacientes.error || 'Erro ao carregar pacientes.');

    selectPaciente.innerHTML = '<option value="">Selecione um paciente</option>';
    pacientes.forEach((paciente) => {
      const option = document.createElement('option');
      option.value = paciente.id;
      option.textContent = paciente.nome;
      selectPaciente.appendChild(option);
    });
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
}

async function carregarAgenda() {
  tabelaAgenda.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';

  try {
    const response = await fetch('/api/listar-agenda');
    const agendamentos = await response.json();

    if (!response.ok) throw new Error(agendamentos.error || 'Erro ao listar agenda.');

    if (!agendamentos.length) {
      tabelaAgenda.innerHTML = '<tr><td colspan="5">Nenhum agendamento cadastrado.</td></tr>';
      return;
    }

    tabelaAgenda.innerHTML = agendamentos.map((item) => {
      const statusClasse = (item.status || '').toLowerCase();
      return `
        <tr>
          <td>${item.id}</td>
          <td>${item.paciente?.nome || '-'}</td>
          <td>${formatarData(item.data)}</td>
          <td>${item.hora || '-'}</td>
          <td><span class="badge ${statusClasse}">${item.status || '-'}</span></td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    tabelaAgenda.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
  }
}

formAgenda.addEventListener('submit', async (event) => {
  event.preventDefault();

  const paciente_id = selectPaciente.value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;
  const status = document.getElementById('status').value;

  if (!paciente_id || !data || !hora || !status) {
    mostrarMensagem('Preencha todos os campos do agendamento.', 'error');
    return;
  }

  try {
    const response = await fetch('/api/add-agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paciente_id, data, hora, status })
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || 'Erro ao cadastrar agendamento.');

    mostrarMensagem('Agendamento cadastrado com sucesso!', 'success');
    formAgenda.reset();
    carregarAgenda();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
});

carregarPacientes();
carregarAgenda();
