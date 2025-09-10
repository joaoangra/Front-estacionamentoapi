# Sistema de Estacionamento - Frontend

Este projeto é a interface web para gerenciar veículos e estadias de um estacionamento. Ele consome uma API RESTful hospedada no Vercel para realizar operações CRUD em veículos e estadias.

---

## Tecnologias Utilizadas

- **JavaScript** (Vanilla)
- **HTML5 / CSS3**
- **Fetch API** para comunicação com backend
- **API REST** hospedada no Vercel (`https://estacionamento-joaoapii2025.vercel.app`)

---

## Funcionalidades

- Listar veículos cadastrados
- Listar estadias em andamento e finalizadas
- Cadastrar nova estadia vinculando a um veículo
- Editar estadia para registrar saída e calcular valor total
- Validação básica de formulário no frontend

---

## Configuração

### 1. API

A API deve estar rodando e disponível na URL:  
`https://estacionamento-joaoapii2025.vercel.app`

Esta API é responsável por armazenar dados dos veículos e estadias, e realizar validações no backend.

---

### 2. Frontend

O frontend consiste nos arquivos HTML, CSS e JavaScript que você deve hospedar localmente ou em um servidor estático.

---

## Uso

### Clonar repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd nome-do-projeto

# Sistema de Estacionamento - Frontend

---

## Abrir o projeto

Abra o arquivo `index.html` (ou equivalente) em seu navegador.

---

## Principais interações

### Cadastrar nova estadia
- Clique em **"Nova Estadia"**
- Selecione a placa do veículo
- Informe a data/hora de entrada e o valor da hora
- Clique em salvar

### Editar estadia
- Clique no botão **"Editar"** na estadia desejada
- Modifique entrada, saída e valor da hora
- O sistema calcula automaticamente o valor total com base na diferença de tempo

---

## Estrutura do Código

- `index.html` - Estrutura da página com modais e elementos
- `styles.css` - Estilos da aplicação
- `relatorio-estadias.js` - Script principal que manipula DOM e faz requisições para a API

---

## Pontos importantes

- A API espera datas no formato **ISO-8601** (`YYYY-MM-DDTHH:mm:ss.sssZ`). Certifique-se que os inputs do formulário enviam datas no formato aceito.
- Para garantir que o cadastro de estadias funcione corretamente, a placa selecionada deve existir na API de veículos.
- O cálculo do valor total da estadia é feito no frontend, multiplicando a diferença em horas pelo valor da hora.

---

## Exemplo de requisição para cadastrar nova estadia

POST https://estacionamento-joaoapii2025.vercel.app/estadias

Content-Type: application/json

{
"placa": "ABC1234",
"entrada": "2025-09-10T14:30:00.000Z",
"valorHora": 10,
"valorTotal": 0
}