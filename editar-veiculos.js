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

  // Função para buscar veículos cadastrados
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

  // Exibir os veículos na tela (renderiza os cards)
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

      // Adiciona o evento de clique no botão de editar
      const editButton = card.querySelector('.edit-button');
      editButton.addEventListener('click', () => openEditModal(vehicle));
    });
  }

  // Função para abrir o modal de edição
  function openEditModal(vehicle) {
    placaInput.value = vehicle.placa;
    placaInput.disabled = true; // Desabilita o campo de placa

    tipoInput.value = vehicle.tipo;
    proprietarioInput.value = vehicle.proprietario;
    modeloInput.value = vehicle.modelo;
    marcaInput.value = vehicle.marca;
    corInput.value = vehicle.cor || '';  // Garantir que cor seja vazia se não existir
    anoInput.value = vehicle.ano || '';  // Garantir que ano seja vazio se não existir
    telefoneInput.value = vehicle.telefone;

    modal.classList.add('show'); // Mostra o modal
    modal.style.visibility = 'visible'; // Torna o modal visível
  }

  // Fechar o modal
  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show'); // Esconde o modal
    modal.style.visibility = 'hidden'; // Esconde o modal
  });

  // Enviar o formulário de edição (atualizar veículo)
  editForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const placa = placaInput.value; // A placa é a chave primária
    const tipo = tipoInput.value;
    const proprietario = proprietarioInput.value;
    const modelo = modeloInput.value;
    const marca = marcaInput.value;
    const cor = corInput.value;
    const ano = parseInt(anoInput.value, 10); // Garantir que ano seja um número
    const telefone = telefoneInput.value;

    // Criação do objeto de dados atualizados
    const updatedVehicle = { tipo, proprietario, modelo, marca, cor, ano, telefone };

    try {
      console.log('Enviando requisição PATCH para:', `https://estacionamento-joaoapii2025.vercel.app/veiculos/${placa}`);
      console.log('Dados enviados:', updatedVehicle);

      // Verificação de dados antes de enviar
      if (!placa || placa.length < 7) {
        throw new Error('A placa fornecida é inválida.');
      }

      // Utilizando a placa diretamente na URL da requisição PATCH
      const res = await fetch(`https://estacionamento-joaoapii2025.vercel.app/veiculos/${placa}`, {
        method: 'PATCH', // Método HTTP para atualização parcial
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedVehicle)
      });

      // Verificar a resposta da API
      if (!res.ok) {
        const errorData = await res.json(); // Captura a resposta de erro
        console.error('Erro ao atualizar o veículo:', errorData);
        throw new Error(`Erro ao atualizar o veículo. Status: ${res.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await res.json(); // Resposta de sucesso
      console.log('Resposta da API:', data);

      // Mensagem de sucesso
      alert('Veículo atualizado com sucesso!');

      // Fecha o modal
      modal.classList.remove('show');
      modal.style.visibility = 'hidden';

      // Recarrega a lista de veículos
      fetchVehicles();
    } catch (error) {
      console.error('Erro:', error);
      alert(`Erro ao salvar as alterações: ${error.message}`);
    }
  });

  // Carregar veículos ao iniciar a página
  fetchVehicles();
});
