// Função para carregar o JSON (permanece a mesma)
async function carregarMembros() {
  try {
    const response = await fetch("membros.json");
    if (!response.ok) {
      throw new Error(`Erro ao carregar o JSON: ${response.statusText}`);
    }
    const data = await response.json();
    return data.membros;
  } catch (error) {
    console.error("Não foi possível carregar os dados dos membros:", error);
    return [];
  }
}

// Referências aos elementos do modal
const myModal = document.getElementById("myModal");
const modalHeader = document.getElementById("modalHeader");
const modalBody = document.getElementById("modalBody");
const modalButton = document.getElementById("modalButton");
const loginForm = document.getElementById("loginForm");
const formErrorMessage = document.getElementById("errorMessage"); // Mensagem de erro do formulário

// Variável global para armazenar a URL de redirecionamento
let redirectUrlOnClose = null;

// Função para exibir o modal
// Adicionado o parâmetro 'redirectUrl'
function showModal(headerText, bodyText, type, redirectUrl = null) {
  modalHeader.textContent = headerText;
  modalBody.textContent = bodyText;

  modalHeader.classList.remove("success", "error");
  if (type === "success") {
    modalHeader.classList.add("success");
    redirectUrlOnClose = redirectUrl; // Define a URL apenas para sucesso
  } else if (type === "error") {
    modalHeader.classList.add("error");
    redirectUrlOnClose = null; // Garante que não haverá redirecionamento em caso de erro
  }

  myModal.classList.add("active");
}

// Função para fechar o modal e redirecionar se aplicável
function hideModal() {
  myModal.classList.remove("active");
  // Se houver uma URL definida para redirecionamento, navega para ela
  if (redirectUrlOnClose) {
    window.location.href = redirectUrlOnClose;
  }
}

// Event listener para fechar o modal ao clicar no botão
modalButton.addEventListener("click", hideModal);
// Event listener para fechar o modal ao clicar no overlay (se não for no conteúdo)
myModal.addEventListener("click", function (event) {
  if (event.target === myModal) {
    hideModal();
  }
});

// Event listener do formulário de login
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const liderInput = document.getElementById("nome").value.trim();
  const riInput = document.getElementById("ri").value.trim();

  formErrorMessage.style.display = "none";

  const membros = await carregarMembros();

  if (membros.length === 0) {
    showModal(
      "Erro!",
      "Não foi possível carregar os dados. Tente novamente mais tarde.",
      "error"
    );
    return;
  }

  let loginValido = false;
  const primeiroNomeInput = liderInput.split(" ")[0].toLowerCase();

  for (const membro of membros) {
    const primeiroNomeJSON = membro.Lider.split(" ")[0].toLowerCase();
    const riJSON = membro.RI;

    if (
      primeiroNomeInput === primeiroNomeJSON &&
      (riInput === riJSON)
    ) {
      loginValido = true;
      // Mostra modal de sucesso e passa a URL de destino
      // Altere 'proxima_pagina.html' para o nome da sua próxima página!
      showModal(
        "Login Bem-Sucedido!",
        `Bem-vindo(a), ${membro.Lider}!`,
        "success",
        "https://presencas-bras.vercel.app/"
      );
      break;
    }
  }

  if (!loginValido) {
    // Mostra modal de erro
    showModal(
      "Erro de Login",
      "Nome do líder ou RI inválidos. Por favor, tente novamente.",
      "error"
    );
  }
});
