document.addEventListener('DOMContentLoaded', () => {
  const vehicleList = document.getElementById('vehicle-list');
  const modal = document.getElementById('edit-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const editForm = document.getElementById('edit-form');
  const placaInput = document.getElementById('placa');
  const tipoInput = document.getElementById('tipo');
  const proprietarioInput = document.getElementById('proprietario');
  const modeloInput = document.getElementById('modelo');
  const marcaInput = document.getElementById('marca');
  const corInput = document.getElementById('cor');
  const anoInput = document.getElementById('ano');
  const telefoneInput = document.getElementById('telefone');

  async function fetchVehicles() {
    try {
      const res = await fetch('https://estacionamento-joaoapii2025.vercel.app/veiculos');
      if (!res.ok) throw new Error('Erro ao carregar veículos.');
      const vehicles = await res.json();
      renderVehicleCards(vehicles);
    } catch (error) {
      console.error(error);
      vehicleList.innerHTML = '<p>Erro ao carregar veículos.</p>';
    }
  }

  function renderVehicleCards(vehicles) {
    vehicleList.innerHTML = '';
    vehicles.forEach(vehicle => {
      const card = document.createElement('div');
      card.classList.add('vehicle-card');
      card.innerHTML = `
        <strong>${vehicle.placa}</strong>
        <div>Modelo: ${vehicle.modelo}</div>
        <div>Marca: ${vehicle.marca}</div>
        <button class="edit-button" data-placa="${vehicle.placa}">Editar</button>
      `;
      vehicleList.appendChild(card);

      const editButton = card.querySelector('.edit-button');
      editButton.addEventListener('click', () => openEditModal(vehicle));
    });
  }

  function openEditModal(vehicle) {
    placaInput.value = vehicle.placa;
    placaInput.disabled = true;

    tipoInput.value = vehicle.tipo;
    proprietarioInput.value = vehicle.proprietario;
    modeloInput.value = vehicle.modelo;
    marcaInput.value = vehicle.marca;
    corInput.value = vehicle.cor || '';
    anoInput.value = vehicle.ano || '';
    telefoneInput.value = vehicle.telefone;

    modal.classList.add('show');
    modal.style.visibility = 'visible';
  }

  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    modal.style.visibility = 'hidden';
  });

  editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const placa = placaInput.value;
    const tipo = tipoInput.value;
    const proprietario = proprietarioInput.value;
    const modelo = modeloInput.value;
    const marca = marcaInput.value;
    const cor = corInput.value;
    const ano = parseInt(anoInput.value, 10);
    const telefone = telefoneInput.value;

    const updatedVehicle = { tipo, proprietario, modelo, marca, cor, ano, telefone };

    try {
      if (!placa || placa.length < 7) {
        throw new Error('A placa fornecida é inválida.');
      }

      const res = await fetch(`https://estacionamento-joaoapii2025.vercel.app/veiculos/${placa}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedVehicle)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Erro ao atualizar o veículo:', errorData);
        throw new Error(`Erro ao atualizar o veículo. Status: ${res.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await res.json();
      console.log('Resposta da API:', data);

      alert('Veículo atualizado com sucesso!');

      modal.classList.remove('show');
      modal.style.visibility = 'hidden';

      fetchVehicles();
    } catch (error) {
      console.error('Erro:', error);
      alert(`Erro ao salvar as alterações: ${error.message}`);
    }
  });

  fetchVehicles();
});
