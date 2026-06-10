const formTarefa = document.getElementById('formTarefa');
const listaTarefas = document.getElementById('listaTarefas');
const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo = '') {
  mensagem.textContent = texto;
  mensagem.className = `msg ${tipo}`.trim();
}

async function carregarTarefas() {
  try {
    const response = await fetch('/api/listar-tarefas');
    const tarefas = await response.json();

    if (!response.ok) throw new Error(tarefas.error || 'Erro ao carregar tarefas.');

    listaTarefas.innerHTML = tarefas.length
      ? tarefas.map((tarefa) => `
          <article class="task-item">
            <h3>${tarefa.titulo}</h3>
            <p>${tarefa.descricao || 'Sem descrição.'}</p>
            <span class="badge">${tarefa.concluida ? 'Concluída' : 'Pendente'}</span>
          </article>
        `).join('')
      : '<p>Nenhuma tarefa cadastrada.</p>';
  } catch (error) {
    console.error(error);
    mostrarMensagem(error.message, 'error');
  }
}

formTarefa.addEventListener('submit', async (event) => {
  event.preventDefault();
  mostrarMensagem('Salvando tarefa...');

  const dados = {
    titulo: document.getElementById('titulo').value.trim(),
    descricao: document.getElementById('descricao').value.trim()
  };

  try {
    const response = await fetch('/api/add-tarefa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar tarefa.');

    formTarefa.reset();
    mostrarMensagem(data.message || 'Tarefa cadastrada com sucesso.', 'success');
    await carregarTarefas();
  } catch (error) {
    console.error(error);
    mostrarMensagem(error.message, 'error');
  }
});

carregarTarefas();
