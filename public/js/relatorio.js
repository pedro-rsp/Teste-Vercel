function formatarData(data) {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function contarStatus(agendamentos, status) {
  return agendamentos.filter(item => String(item.status || '').toLowerCase() === status.toLowerCase()).length;
}

function linhaVazia(colunas, texto) {
  return `<tr><td colspan="${colunas}">${texto}</td></tr>`;
}

async function carregarRelatorio() {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  document.getElementById('dataRelatorio').textContent = `Emitido em ${dataAtual}`;

  try {
    const [pacientesRes, agendaRes, tarefasRes] = await Promise.all([
      fetch('/api/listar-pacientes'),
      fetch('/api/listar-agenda'),
      fetch('/api/listar-tarefas')
    ]);

    const pacientes = await pacientesRes.json();
    const agendamentos = await agendaRes.json();
    const tarefas = await tarefasRes.json();

    const confirmadas = contarStatus(agendamentos, 'Confirmada');
    const pendentes = contarStatus(agendamentos, 'Pendente');
    const canceladas = contarStatus(agendamentos, 'Cancelada');
    const tarefasAbertas = tarefas.filter(tarefa => !tarefa.concluida).length;

    document.getElementById('rPacientes').textContent = pacientes.length;
    document.getElementById('rAgendamentos').textContent = agendamentos.length;
    document.getElementById('rTarefas').textContent = tarefas.length;
    document.getElementById('rPendencias').textContent = pendentes + tarefasAbertas;

    document.getElementById('resumoStatus').innerHTML = `
      <tr><td>Confirmadas</td><td>${confirmadas}</td></tr>
      <tr><td>Pendentes</td><td>${pendentes}</td></tr>
      <tr><td>Canceladas</td><td>${canceladas}</td></tr>
    `;

    const pacientesBody = document.getElementById('relatorioPacientes');
    pacientesBody.innerHTML = pacientes.length ? '' : linhaVazia(3, 'Nenhum paciente cadastrado.');
    pacientes.forEach(item => {
      pacientesBody.innerHTML += `
        <tr>
          <td>${item.nome || '-'}</td>
          <td>${item.telefone || '-'}</td>
          <td>${item.email || '-'}</td>
        </tr>
      `;
    });

    const agendaBody = document.getElementById('relatorioAgenda');
    agendaBody.innerHTML = agendamentos.length ? '' : linhaVazia(4, 'Nenhum agendamento cadastrado.');
    agendamentos.forEach(item => {
      const classe = String(item.status || '').toLowerCase();
      agendaBody.innerHTML += `
        <tr>
          <td>${item.paciente?.nome || '-'}</td>
          <td>${formatarData(item.data)}</td>
          <td>${item.hora || '-'}</td>
          <td><span class="badge ${classe}">${item.status || '-'}</span></td>
        </tr>
      `;
    });

    const tarefasBody = document.getElementById('relatorioTarefas');
    tarefasBody.innerHTML = tarefas.length ? '' : linhaVazia(3, 'Nenhuma tarefa cadastrada.');
    tarefas.forEach(item => {
      tarefasBody.innerHTML += `
        <tr>
          <td>${item.titulo || '-'}</td>
          <td>${item.descricao || '-'}</td>
          <td>${item.concluida ? 'Concluída' : 'Pendente'}</td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Erro ao carregar relatório:', error);
    alert('Erro ao carregar relatório. Verifique a conexão com a API.');
  }
}

carregarRelatorio();
