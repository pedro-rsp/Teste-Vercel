function formatarData(data) {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function contarPorStatus(agendamentos, status) {
  return agendamentos.filter(item => String(item.status || '').toLowerCase() === status.toLowerCase()).length;
}

function percentual(valor, total) {
  if (!total) return 0;
  return Math.round((valor / total) * 100);
}

function preencherBarra(idTexto, idBarra, valor, total) {
  const pct = percentual(valor, total);
  document.getElementById(idTexto).textContent = `${pct}%`;
  document.getElementById(idBarra).style.width = `${pct}%`;
}

async function carregarDashboard() {
  try {
    const [pacientesRes, agendaRes, tarefasRes] = await Promise.all([
      fetch('/api/listar-pacientes'),
      fetch('/api/listar-agenda'),
      fetch('/api/listar-tarefas')
    ]);

    const pacientes = await pacientesRes.json();
    const agendamentos = await agendaRes.json();
    const tarefas = await tarefasRes.json();

    const confirmadas = contarPorStatus(agendamentos, 'Confirmada');
    const pendentes = contarPorStatus(agendamentos, 'Pendente');
    const canceladas = contarPorStatus(agendamentos, 'Cancelada');
    const tarefasConcluidas = tarefas.filter(tarefa => tarefa.concluida).length;
    const tarefasAbertas = tarefas.length - tarefasConcluidas;

    document.getElementById('totalPacientes').textContent = pacientes.length;
    document.getElementById('totalAgendamentos').textContent = agendamentos.length;
    document.getElementById('totalConfirmadas').textContent = confirmadas;
    document.getElementById('tarefasAbertas').textContent = tarefasAbertas;
    document.getElementById('totalTarefas').textContent = tarefas.length;
    document.getElementById('tarefasConcluidas').textContent = tarefasConcluidas;
    document.getElementById('agendamentosPendentes').textContent = pendentes;

    preencherBarra('pctConfirmadas', 'barConfirmadas', confirmadas, agendamentos.length);
    preencherBarra('pctPendentes', 'barPendentes', pendentes, agendamentos.length);
    preencherBarra('pctCanceladas', 'barCanceladas', canceladas, agendamentos.length);

    const proximas = agendamentos
      .filter(item => item.data)
      .sort((a, b) => `${a.data} ${a.hora || ''}`.localeCompare(`${b.data} ${b.hora || ''}`));

    if (proximas.length > 0) {
      const item = proximas[0];
      document.getElementById('proximaSessao').textContent = `Próxima sessão: ${item.paciente?.nome || 'Paciente'} em ${formatarData(item.data)} às ${item.hora || '-'}`;
    }

    const tbody = document.getElementById('ultimosAgendamentos');
    tbody.innerHTML = '';

    agendamentos.slice(0, 5).forEach(item => {
      const tr = document.createElement('tr');
      const classe = String(item.status || '').toLowerCase();
      tr.innerHTML = `
        <td>${item.paciente?.nome || '-'}</td>
        <td>${formatarData(item.data)}</td>
        <td>${item.hora || '-'}</td>
        <td><span class="badge ${classe}">${item.status || '-'}</span></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    alert('Erro ao carregar dashboard. Verifique a conexão com a API.');
  }
}

carregarDashboard();
