// Função para carregar o JSON
// Permanece assíncrona para buscar os dados dos membros
async function carregarMembros() {
    try {
        const response = await fetch("membros.json");
        // Verifica se a resposta da requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao carregar o JSON: ${response.statusText}`);
        }
        const data = await response.json();
        return data.membros; // Retorna o array de membros
    } catch (error) {
        // Loga o erro no console para depuração
        console.error("Não foi possível carregar os dados dos membros:", error);
        return []; // Retorna um array vazio em caso de falha
    }
}

// Referências aos elementos HTML do modal
const myModal = document.getElementById("myModal");
const modalHeader = document.getElementById("modalHeader");
const modalBody = document.getElementById("modalBody");
const modalButton = document.getElementById("modalButton");

// Referências aos elementos do formulário de login
const loginForm = document.getElementById("loginForm");
const formErrorMessage = document.getElementById("errorMessage");

// Variável global para controlar a URL de redirecionamento após fechar o modal
let redirectUrlOnClose = null;

// Função para exibir o modal personalizado
// 'headerText': Título do modal (ex: "Sucesso!", "Erro!")
// 'bodyText': Conteúdo da mensagem do modal
// 'type': Tipo da mensagem ('success' para verde, 'error' para vermelho)
// 'redirectUrl': URL opcional para redirecionar após fechar o modal (usado apenas para sucesso)
function showModal(headerText, bodyText, type, redirectUrl = null) {
    modalHeader.textContent = headerText; // Define o título do modal
    modalBody.textContent = bodyText;     // Define o corpo da mensagem do modal

    // Remove classes de estilo anteriores e aplica a nova baseada no tipo
    modalHeader.classList.remove("success", "error");
    if (type === "success") {
        modalHeader.classList.add("success");
        // Armazena a URL de redirecionamento APENAS se for um modal de sucesso
        redirectUrlOnClose = redirectUrl;
    } else if (type === "error") {
        modalHeader.classList.add("error");
        // Garante que não haverá redirecionamento se for um modal de erro
        redirectUrlOnClose = null;
    }

    myModal.classList.add("active"); // Adiciona a classe 'active' para exibir o modal (via CSS)
}

// Função para fechar o modal e, se aplicável, redirecionar a página
function hideModal() {
    myModal.classList.remove("active"); // Remove a classe 'active' para esconder o modal
    // Se uma URL de redirecionamento foi definida (no caso de login bem-sucedido), navega para ela
    if (redirectUrlOnClose) {
        window.location.href = redirectUrlOnClose;
    }
}

// Adiciona um 'listener' ao botão 'Fechar' do modal para ocultá-lo
modalButton.addEventListener("click", hideModal);

// Adiciona um 'listener' ao overlay do modal para ocultá-lo quando clicado fora do conteúdo
myModal.addEventListener("click", function (event) {
    // Verifica se o clique ocorreu diretamente no overlay (e não no conteúdo do modal)
    if (event.target === myModal) {
        hideModal();
    }
});

// Adiciona um 'listener' ao formulário de login para lidar com o envio
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário (recarregar a página)

    // Obtém os valores digitados nos campos de input
    const liderInput = document.getElementById("nome").value.trim();
    const riInput = document.getElementById("ri").value.trim();

    // Oculta qualquer mensagem de erro anterior no formulário
    formErrorMessage.style.display = "none";

    // Carrega os dados dos membros do JSON
    const membros = await carregarMembros();

    // Se não houver dados de membros, exibe um erro no modal
    if (membros.length === 0) {
        showModal(
            "Erro!",
            "Não foi possível carregar os dados. Tente novamente mais tarde.",
            "error"
        );
        return; // Sai da função, pois não há dados para validar
    }

    let loginValido = false; // Flag para indicar se o login foi bem-sucedido
    // Extrai o primeiro nome do líder digitado e o converte para minúsculas para comparação não sensível a maiúsculas/minúsculas
    const primeiroNomeInput = liderInput.split(" ")[0].toLowerCase();
   nomeCompletoMembroLogado = membro.Lider; // Captura o nome completo do membro logado (Nome do JSON)
            
            // Salva o nome completo do membro no localStorage para uso na próxima página
            localStorage.setItem('nomeLiderLogado', nomeCompletoMembroLogado);

    // Itera sobre cada membro para tentar validar o login
    for (const membro of membros) {
        // Extrai o primeiro nome do líder do JSON e o converte para minúsculas
        const primeiroNomeJSON = membro.Lider.split(" ")[0].toLowerCase();
        const riJSON = membro.RI; // Obtém o RI do membro do JSON

        // Condição de validação:
        // O primeiro nome do líder digitado DEVE corresponder ao do JSON
        // E o RI digitado DEVE corresponder ao RI do JSON (sem a opção 123456)
        if (
            primeiroNomeInput === primeiroNomeJSON &&
            riInput === riJSON
        ) {
            loginValido = true; // Define a flag como true se o login for válido
            nomeCompletoMembroLogado = membro.Nome; // Captura o nome completo do membro logado (Nome do JSON)
            
            // Salva o nome completo do membro no localStorage para uso na próxima página
            localStorage.setItem('nomeLiderLogado', nomeCompletoMembroLogado);

            // Exibe o modal de sucesso com a URL de redirecionamento
            showModal(
                "Login Bem-Sucedido!",
                `Bem-vindo(a), ${membro.Lider}!`, // Exibe o nome do líder (do JSON) no modal
                "success",
                "https://presencas-bras.vercel.app/" // URL para onde redirecionar
            );
            break; // Sai do loop assim que um login válido é encontrado
        }
    }

    // Se o loop terminar e o login não for válido, exibe o modal de erro
    if (!loginValido) {
        showModal(
            "Erro de Login",
            "Nome do líder ou RI inválidos. Por favor, tente novamente.",
            "error"
        );
    }
});
