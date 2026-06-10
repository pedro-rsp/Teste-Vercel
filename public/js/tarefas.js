const formTarefa = document.getElementById('formTarefa');
const listaTarefas = document.getElementById('listaTarefas');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo = '') {
  mensagem.textContent = texto;
  mensagem.className = `msg ${tipo}`.trim();
}

async function carregarTarefas() {
  const response = await fetch('/api/listar-tarefas');
  const tarefas = await response.json();

  listaTarefas.innerHTML = '';

  if (!Array.isArray(tarefas) || tarefas.length === 0) {
    listaTarefas.innerHTML = '<p>Nenhuma tarefa cadastrada.</p>';
    return;
  }

  tarefas.forEach((tarefa) => {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.innerHTML = `
      <h3>${tarefa.titulo || ''}</h3>
      <p>${tarefa.descricao || 'Sem descrição.'}</p>
      <span>${tarefa.concluida ? 'Concluída' : 'Pendente'}</span>
    `;
    listaTarefas.appendChild(div);
  });
}

formTarefa.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    titulo: document.getElementById('titulo').value.trim(),
    descricao: document.getElementById('descricao').value.trim()
  };

  try {
    const response = await fetch('/api/add-tarefa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarMensagem(data.error || 'Erro ao cadastrar tarefa.', 'erro');
      return;
    }

    formTarefa.reset();
    mostrarMensagem(data.message || 'Tarefa cadastrada com sucesso.', 'sucesso');
    carregarTarefas();
  } catch (error) {
    mostrarMensagem('Erro de conexão com o servidor.', 'erro');
  }
});

carregarTarefas();
