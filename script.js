document.addEventListener('DOMContentLoaded', () => {
  const vehicleList = document.querySelector('.vehicle-list');
  const estadiasList = document.querySelector('.estadias-list');

  // Função para abrir o menu dropdown
  const menuIcon = document.getElementById('menu-icon');
  const dropdownMenu = document.getElementById('dropdown-menu');
  
  menuIcon.addEventListener('click', () => {
    const isShown = dropdownMenu.classList.toggle('show');
    dropdownMenu.setAttribute('aria-hidden', !isShown);
  });

  document.addEventListener('click', (event) => {
    if (!menuIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove('show');
      dropdownMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Função para buscar os veículos da API
  async function fetchVehicles() {
    try {
      const response = await fetch('https://estacionamento-joaoapii2025.vercel.app/veiculos');
      if (!response.ok) throw new Error('Erro ao buscar veículos da API');

      const vehicles = await response.json();
      renderVehicleCards(vehicles);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      vehicleList.innerHTML = '<p class="error">Erro ao carregar veículos.</p>';
    }
  }

  // Função para buscar as estadias da API
  async function fetchEstadias() {
    try {
      const response = await fetch('https://estacionamento-joaoapii2025.vercel.app/estadias');
      if (!response.ok) throw new Error('Erro ao buscar estadias da API');

      const estadias = await response.json();
      renderEstadiasCards(estadias);
    } catch (error) {
      console.error('Erro ao buscar estadias:', error);
      estadiasList.innerHTML = '<p class="error">Erro ao carregar estadias.</p>';
    }
  }

  // Função para criar o card de veículos
  function createVehicleCard(vehicle) {
    const card = document.createElement('section');
    card.className = 'vehicle-card';

    const plateDiv = document.createElement('div');
    plateDiv.innerHTML = `<strong>${vehicle.placa}</strong>`;
    card.appendChild(plateDiv);

    const entryDiv = document.createElement('div');
    entryDiv.textContent = `Entrada: ${formatarData(vehicle.entrada)}`;
    card.appendChild(entryDiv);

    const exitDiv = document.createElement('div');
    exitDiv.textContent = `Saída: ${vehicle.saida ? formatarData(vehicle.saida) : 'Em aberto'}`;
    card.appendChild(exitDiv);

    const valorHora = vehicle.valorHora || 0;
    const valorTotal = vehicle.valorTotal || 0;

    const valueDiv = document.createElement('div');
    valueDiv.innerHTML = `Valor Hora: R$ ${valorHora.toFixed(2).replace('.', ',')} <span class="total">Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}</span>`;
    card.appendChild(valueDiv);

    return card;
  }

  // Função para renderizar os cards de veículos
  function renderVehicleCards(vehicles) {
    vehicleList.innerHTML = ''; // limpa antes
    vehicles.forEach(vehicle => {
      const card = createVehicleCard(vehicle);
      vehicleList.appendChild(card);
    });
  }

  // Função para criar o card de estadias
  function createEstadiaCard(estadia) {
    const card = document.createElement('section');
    card.className = 'estadia-card';

    const plateDiv = document.createElement('div');
    plateDiv.innerHTML = `<strong>${estadia.placa}</strong>`;
    card.appendChild(plateDiv);

    const entryDiv = document.createElement('div');
    entryDiv.textContent = `Entrada: ${formatarData(estadia.entrada)}`;
    card.appendChild(entryDiv);

    const exitDiv = document.createElement('div');
    exitDiv.textContent = `Saída: ${estadia.saida ? formatarData(estadia.saida) : 'Em aberto'}`;
    card.appendChild(exitDiv);

    const valorHora = estadia.valorHora || 0;
    const valorTotal = estadia.valorTotal || 0;

    const valueDiv = document.createElement('div');
    valueDiv.innerHTML = `Valor Hora: R$ ${valorHora.toFixed(2).replace('.', ',')} <span class="total">Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}</span>`;
    card.appendChild(valueDiv);

    return card;
  }

  // Função para renderizar os cards de estadias
  function renderEstadiasCards(estadias) {
    estadiasList.innerHTML = ''; // limpa antes
    estadias.forEach(estadia => {
      const card = createEstadiaCard(estadia);
      estadiasList.appendChild(card);
    });
  }

  // Função para formatar a data
  function formatarData(dataString) {
    const data = new Date(dataString);
    if (isNaN(data)) return dataString;

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${hora}:${min}`;
  }

  // Chamada inicial para buscar e renderizar os dados
  fetchVehicles();
  fetchEstadias();
});
