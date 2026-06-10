protegerPagina();

const formTarefa = document.getElementById('formTarefa');
const listaTarefas = document.getElementById('listaTarefas');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `msg ${tipo}`;
}

async function carregarTarefas() {
  listaTarefas.innerHTML = '<p>Carregando...</p>';

  try {
    const response = await fetch('/api/listar-tarefas');
    const tarefas = await response.json();

    if (!response.ok) throw new Error(tarefas.error || 'Erro ao listar tarefas.');

    if (!tarefas.length) {
      listaTarefas.innerHTML = '<p>Nenhuma tarefa cadastrada.</p>';
      return;
    }

    listaTarefas.innerHTML = tarefas.map((tarefa) => `
      <article class="task-item">
        <h3>${tarefa.titulo || '-'}</h3>
        <p>${tarefa.descricao || 'Sem descrição.'}</p>
        <span class="badge">${tarefa.concluida ? 'Concluída' : 'Pendente'}</span>
      </article>
    `).join('');
  } catch (error) {
    listaTarefas.innerHTML = `<p>${error.message}</p>`;
  }
}

formTarefa.addEventListener('submit', async (event) => {
  event.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();

  if (!titulo) {
    mostrarMensagem('Informe o título da tarefa.', 'error');
    return;
  }

  try {
    const response = await fetch('/api/add-tarefa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descricao })
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || 'Erro ao cadastrar tarefa.');

    mostrarMensagem('Tarefa cadastrada com sucesso!', 'success');
    formTarefa.reset();
    carregarTarefas();
  } catch (error) {
    mostrarMensagem(error.message, 'error');
  }
});

carregarTarefas();
