document.addEventListener('DOMContentLoaded', async () => {
  const estadiasList = document.getElementById('estadias-list').querySelector('.list-content');
  const cadastradosList = document.getElementById('cadastrados-list').querySelector('.list-content');
  const modalNovaEstadia = document.getElementById('nova-estadia-modal');
  const modalEditarEstadia = document.getElementById('edit-modal');
  const placaSelect = document.getElementById('placa-select');
  const novaEstadiaForm = document.getElementById('nova-estadia-form');
  const editForm = document.getElementById('edit-form');
  const placaDisplay = document.getElementById('placa-display');
  const fecharNovaEstadia = document.getElementById('fechar-nova-estadia');
  const fecharEditarEstadia = document.getElementById('fechar-editar-estadia');
  const abrirNovaEstadiaBtn = document.getElementById('abrir-nova-estadia');

  function limparSelectPlaca() {
    placaSelect.innerHTML = '<option value="">Selecione uma placa</option>';
  }

  function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const pad = num => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  async function carregarVeiculosEEstadias() {
    try {
      limparSelectPlaca();

      const resVeiculos = await fetch('https://estacionamento-joaoapii2025.vercel.app/veiculos');
      if (!resVeiculos.ok) throw new Error('Erro ao carregar veículos');
      const veiculos = await resVeiculos.json();

      cadastradosList.innerHTML = '';
      veiculos.forEach(veiculo => {
        const veiculoCard = document.createElement('article');
        veiculoCard.classList.add('veiculo-card');
        veiculoCard.innerHTML = `
          <strong>Placa: ${veiculo.placa}</strong>
          <p>Modelo: ${veiculo.modelo}</p>
          <p>Marca: ${veiculo.marca}</p>
        `;
        cadastradosList.appendChild(veiculoCard);

        const option = document.createElement('option');
        option.value = veiculo.placa;
        option.textContent = veiculo.placa;
        placaSelect.appendChild(option);
      });

      const resEstadias = await fetch('https://estacionamento-joaoapii2025.vercel.app/estadias');
      if (!resEstadias.ok) throw new Error('Erro ao carregar estadias');
      const estadias = await resEstadias.json();

      estadiasList.innerHTML = '';
      estadias.forEach(estadia => {
        const card = document.createElement('article');
        card.classList.add('vehicle-card');

        const entrada = new Date(estadia.entrada).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        const saida = estadia.saida
          ? new Date(estadia.saida).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
          : 'Ainda no estacionamento';

        const valorHoraFormatado = (estadia.valorHora ?? 0).toFixed(2).replace('.', ',');
        const valorTotalFormatado = (estadia.valorTotal ?? 0).toFixed(2).replace('.', ',');

        card.innerHTML = `
          <strong>Placa: ${estadia.placa}</strong>
          <div class="vehicle-info">
            <span>Entrada: ${entrada}</span>
            <span>Saída: ${saida}</span>
            <span>Valor Hora: R$ ${valorHoraFormatado}</span>
          </div>
          <div class="total-value">Total: R$ ${valorTotalFormatado}</div>
          <button class="edit-button" data-id="${estadia.id}">Editar</button>
        `;

        estadiasList.appendChild(card);

        card.querySelector('.edit-button').addEventListener('click', () => abrirModalEdicao(estadia));
      });
    } catch (error) {
      estadiasList.innerHTML = `<p>Erro: ${error.message}</p>`;
      cadastradosList.innerHTML = `<p>Erro: ${error.message}</p>`;
      console.error(error);
    }
  }

  function abrirModalEdicao(estadia) {
    placaDisplay.textContent = estadia.placa;
    editForm.querySelector('input[name="id"]').value = estadia.id;
    editForm['edit-entrada'].value = formatDateForInput(estadia.entrada);
    editForm['edit-saida'].value = estadia.saida ? formatDateForInput(estadia.saida) : '';
    editForm['edit-valorHora'].value = estadia.valorHora ?? '';

    modalEditarEstadia.classList.remove('hidden');
  }

  fecharEditarEstadia.addEventListener('click', () => {
    modalEditarEstadia.classList.add('hidden');
  });

  fecharNovaEstadia.addEventListener('click', () => {
    modalNovaEstadia.classList.add('hidden');
  });

  abrirNovaEstadiaBtn.addEventListener('click', () => {
    novaEstadiaForm.reset();
    modalNovaEstadia.classList.remove('hidden');
  });

  novaEstadiaForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const placa = novaEstadiaForm.placa.value;
  const entradaRaw = novaEstadiaForm.entrada.value;
  const valorHora = parseFloat(novaEstadiaForm.valorHora.value);

  if (!placa) {
    alert('Selecione uma placa.');
    return;
  }

  if (!entradaRaw || isNaN(valorHora)) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const entrada = new Date(entradaRaw).toISOString();

  try {
    const res = await fetch('https://estacionamento-joaoapii2025.vercel.app/estadias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placa,
        entrada,
        valorHora,
        valorTotal: 0
      })
    });

    let errData = {};
    try {
      errData = await res.json();
    } catch (_) {}

    if (!res.ok) {
      console.error('Erro ao cadastrar estadia:', errData);
      alert(errData.erro || errData.message || 'Erro ao cadastrar estadia');
      return;
    }

    alert('Estadia cadastrada com sucesso!');
    modalNovaEstadia.classList.add('hidden');
    carregarVeiculosEEstadias();

  } catch (error) {
    alert('Erro: ' + error.message);
    console.error(error);
  }
});


 editForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = editForm.querySelector('input[name="id"]').value;
  const entradaRaw = editForm['edit-entrada'].value;
  const saidaRaw = editForm['edit-saida'].value;
  const valorHora = parseFloat(editForm['edit-valorHora'].value);

  if (!entradaRaw || isNaN(valorHora)) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const entradaDate = new Date(entradaRaw);
  if (isNaN(entradaDate)) {
    alert('Data de entrada inválida.');
    return;
  }
  const entrada = entradaDate.toISOString();

  let saida = null;
  if (saidaRaw) {
    const saidaDate = new Date(saidaRaw);
    if (isNaN(saidaDate)) {
      alert('Data de saída inválida.');
      return;
    }
    saida = saidaDate.toISOString();

    if (saidaDate < entradaDate) {
      alert('A saída não pode ser antes da entrada');
      return;
    }
  }

  let valorTotal = 0;
  if (saida) {
    const diffHoras = (new Date(saida).getTime() - new Date(entrada).getTime()) / (1000 * 60 * 60);
    valorTotal = diffHoras * valorHora;
  }

  try {
    const res = await fetch(`https://estacionamento-joaoapii2025.vercel.app/estadias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entrada,
        saida,
        valorHora,
        valorTotal
      })
    });

    let errData = {};
    try {
      errData = await res.json();
    } catch (_) {}

    if (!res.ok) {
      console.error('Erro ao editar estadia:', errData);
      throw new Error(errData.message || 'Erro ao editar estadia');
    }

    alert('Estadia editada com sucesso!');
    modalEditarEstadia.classList.add('hidden');
    carregarVeiculosEEstadias();
  } catch (error) {
    alert('Erro: ' + error.message);
    console.error(error);
  }
});


  carregarVeiculosEEstadias();
});
