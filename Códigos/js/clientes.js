const inputBusca = document.querySelector(".topoClientes input");
const tabela = document.querySelector("tbody");
const total = document.querySelector(".total");

const btNovo = document.querySelector(".topoClientes button");

let modoEdicao = false;
let linhaEditando = null;

const modal = document.createElement("div");
modal.classList.add("modal");
modal.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: none;
    justify-content: center;
    align-items: center;
`;

modal.innerHTML = `
    <div class="janela" style="
        background: white;
        padding: 30px;
        border-radius: 15px;
        width: 350px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    ">
        <h2 id="tituloModal">Novo Cliente</h2>

        <input id="nome" placeholder="Nome">
        <input id="tel" placeholder="Telefone">
        <input id="email" placeholder="Email">
        <input id="endereco" placeholder="Endereço">
        <input id="data" placeholder="Data de cadastro">

        <button id="salvar" style="
            background:#5e2c2f;
            color:#d8bfa5;
            padding:10px;
            border:none;
            border-radius:7px;
            cursor:pointer;
        ">Salvar</button>

        <button id="cancelar" style="
            background:#ccc;
            padding:8px;
            border:none;
            border-radius:7px;
            cursor:pointer;
        ">Cancelar</button>
    </div>
`;

document.body.appendChild(modal);

const nome = modal.querySelector("#nome");
const tel = modal.querySelector("#tel");
const email = modal.querySelector("#email");
const endereco = modal.querySelector("#endereco");
const dataCad = modal.querySelector("#data");
const btnSalvar = modal.querySelector("#salvar");
const btnCancelar = modal.querySelector("#cancelar");

function atualizarTotal() {
    const linhas = tabela.querySelectorAll("tr").length;
    total.textContent = "Total: " + linhas;
}

inputBusca.addEventListener("input", () => {
    const termo = inputBusca.value.toLowerCase();
    const linhas = tabela.querySelectorAll("tr");

    linhas.forEach(linha => {
        const texto = linha.innerText.toLowerCase();
        linha.style.display = texto.includes(termo) ? "" : "none";
    });
});

function abrirModal(editando = false) {
    modoEdicao = editando;
    modal.style.display = "flex";

    if (!editando) {
        document.querySelector("#tituloModal").textContent = "Novo Cliente";
        nome.value = "";
        tel.value = "";
        email.value = "";
        endereco.value = "";
        dataCad.value = "";
    }
}

function fecharModal() {
    modal.style.display = "none";
}

btNovo.addEventListener("click", () => {
    linhaEditando = null;
    abrirModal(false);
});

btnCancelar.addEventListener("click", fecharModal);

tabela.addEventListener("click", (e) => {
    const btn = e.target;

    if (btn.classList.contains("btExcluir")) {
        btn.closest("tr").remove();
        atualizarTotal();
        return;
    }

    if (btn.classList.contains("btEditar")) {
        linhaEditando = btn.closest("tr");
        const celulas = linhaEditando.querySelectorAll("td");

        nome.value = celulas[0].textContent;
        tel.value = celulas[1].textContent;
        email.value = celulas[2].textContent;
        endereco.value = celulas[3].textContent;
        dataCad.value = celulas[4].textContent;

        document.querySelector("#tituloModal").textContent = "Editar Cliente";

        abrirModal(true);
    }
});

btnSalvar.addEventListener("click", () => {
    if (!nome.value.trim()) {
        alert("O nome é obrigatório.");
        return;
    }

    if (modoEdicao && linhaEditando) {
        const celulas = linhaEditando.querySelectorAll("td");
        celulas[0].textContent = nome.value;
        celulas[1].textContent = tel.value;
        celulas[2].textContent = email.value;
        celulas[3].textContent = endereco.value;
        celulas[4].textContent = dataCad.value;

    } else {
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
            <td>${nome.value}</td>
            <td>${tel.value}</td>
            <td>${email.value}</td>
            <td>${endereco.value}</td>
            <td>${dataCad.value}</td>
            <td>
                <button class="btEditar">Editar</button>
                <button class="btExcluir">Excluir</button>
            </td>
        `;
        tabela.appendChild(novaLinha);
    }

    atualizarTotal();
    fecharModal();
});

atualizarTotal();
