document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('novo-veiculo-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const placa = form.placa.value.trim().toUpperCase();
    const tipo = form.tipo.value.trim();
    const proprietario = form.proprietario.value.trim();
    const modelo = form.modelo.value.trim();
    const marca = form.marca.value.trim();
    const cor = form.cor.value.trim();
    const ano = parseInt(form.ano.value, 10);
    const telefone = form.telefone.value.trim();

    if (
      !placa || !tipo || !proprietario || !modelo || !marca || !cor ||
      !ano || !telefone ||
      isNaN(ano) || telefone.length < 10 || telefone.length > 11
    ) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const payload = {
      placa,
      tipo,
      proprietario,
      modelo,
      marca,
      cor,
      ano,
      telefone
    };

    try {
      const response = await fetch('https://estacionamento-joaoapii2025.vercel.app/veiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar veículo');
      }

      alert('✅ Veículo cadastrado com sucesso!');
      form.reset();
    } catch (error) {
      console.error(error);
      alert('❌ Erro ao cadastrar o veículo: ' + error.message);
    }
  });
});
