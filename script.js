// Estado global da aplicação carregado do localStorage ou inicializado vazio
let state = JSON.parse(localStorage.getItem('ubs_state')) || {
    fila: [],
    emAtendimento: null,
    metricas: {
        total: 0,
        triagem: 0,
        consulta: 0,
        vacinacao: 0,
        curativo: 0
    }
};

// Elementos do DOM
const formPaciente = document.getElementById('form-paciente');
const inputNome = document.getElementById('nome');
const inputDocumento = document.getElementById('documento');
const inputTipo = document.getElementById('tipo');
const listaFila = document.getElementById('lista-fila');
const containerEmAtendimento = document.getElementById('em-atendimento');
const btnChamar = document.getElementById('btn-chamar');
const btnReset = document.getElementById('btn-reset');

// Contadores de métricas na tela
const spanTotal = document.getElementById('contador-total');
const spanTriagem = document.getElementById('contador-triagem');
const spanConsulta = document.getElementById('contador-consulta');
const spanVacinacao = document.getElementById('contador-vacinacao');
const spanCurativo = document.getElementById('contador-curativo');

// Salva o estado atual no localStorage
function salvarEstado() {
    localStorage.setItem('ubs_state', JSON.stringify(state));
}

// Renderiza todas as informações na tela
function renderizar() {
    // 1. Renderiza Fila de Espera
    listaFila.innerHTML = '';
    if (state.fila.length === 0) {
        listaFila.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b;">Fila vazia</td></tr>`;
    } else {
        state.fila.forEach((paciente, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${paciente.nome}</td>
                <td>${paciente.tipo}</td>
                <td><span class="badge badge-aguardando">Aguardando</span></td>
            `;
            listaFila.appendChild(tr);
        });
    }

    // 2. Renderiza Painel "Em Atendimento"
    if (state.emAtendimento) {
        containerEmAtendimento.innerHTML = `
            <div class="patient-on-call">
                <h3>${state.emAtendimento.nome}</h3>
                <p>Serviço: <strong>${state.emAtendimento.tipo}</strong> | Doc: ${state.emAtendimento.documento}</p>
            </div>
        `;
    } else {
        containerEmAtendimento.innerHTML = `<p class="empty-text">Nenhum paciente sendo atendido no momento.</p>`;
    }

    // 3. Renderiza Métricas
    spanTotal.textContent = state.metricas.total;
    spanTriagem.textContent = state.metricas.triagem;
    spanConsulta.textContent = state.metricas.consulta;
    spanVacinacao.textContent = state.metricas.vacinacao;
    spanCurativo.textContent = state.metricas.curativo;
}

// Evento: Adicionar Paciente à Fila
formPaciente.addEventListener('submit', (e) => {
    e.preventDefault();

    const novoPaciente = {
        nome: inputNome.value.trim(),
        documento: inputDocumento.value.trim(),
        tipo: inputTipo.value
    };

    state.fila.push(novoPaciente);
    salvarEstado();
    renderizar();

    formPaciente.reset();
});

// Evento: Chamar Próximo Paciente
btnChamar.addEventListener('click', () => {
    if (state.fila.length === 0) {
        alert('Não há pacientes na fila de espera.');
        return;
    }

    // Remove o primeiro da fila
    const proximo = state.fila.shift();
    state.emAtendimento = proximo;

    // Atualiza as métricas globais e por categoria
    state.metricas.total++;
    
    switch (proximo.tipo) {
        case 'Triagem':
            state.metricas.triagem++;
            break;
        case 'Consulta Médica':
            state.metricas.consulta++;
            break;
        case 'Vacinação':
            state.metricas.vacinacao++;
            break;
        case 'Curativo':
            state.metricas.curativo++;
            break;
    }

    salvarEstado();
    renderizar();
});

// Evento: Reiniciar o Dia (Reset)
btnReset.addEventListener('click', () => {
    if (confirm('Deseja realmente reiniciar o dia? Todos os dados atuais e métricas serão apagados.')) {
        state = {
            fila: [],
            emAtendimento: null,
            metricas: {
                total: 0,
                triagem: 0,
                consulta: 0,
                vacinacao: 0,
                curativo: 0
            }
        };
        salvarEstado();
        renderizar();
    }
});

// Executa a primeira renderização ao carregar a página
renderizar();