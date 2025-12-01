const inputBusca = document.querySelector(".topoVendas input");
const tabela = document.querySelector("tbody");
const totalEl = document.querySelector(".total");
const btNovo = document.querySelector(".topoVendas button");

let modoEdicao = false;
let linhaEditando = null;

const modal = document.createElement("div");
modal.classList.add("modalVendas");
modal.style.cssText = `
  position: fixed;
  top:0; left:0;
  width:100%; height:100%;
  background: rgba(0,0,0,0.5);
  display:none;
  justify-content:center;
  align-items:center;
  z-index: 9999;
`;

modal.innerHTML = `
  <div class="janela" style="
    background: white;
    padding: 28px;
    border-radius: 12px;
    width: 360px;
    display:flex;
    flex-direction:column;
    gap:10px;
  ">
    <h2 id="tituloModal">Nova venda</h2>

    <input id="cliente" type="text" placeholder="Cliente">
    <input id="funcionario" type="text" placeholder="Funcionário">
    <input id="data" type="date" placeholder="Data">
    <input id="pagamento" type="text" placeholder="Forma de pagamento">

    <div style="display:flex; gap:8px; margin-top:6px;">
      <button id="salvar" style="
        background:#5e2c2f;
        color:#d8bfa5;
        padding:10px;
        border:none;
        border-radius:7px;
        cursor:pointer;
        flex:1;
      ">Salvar</button>

      <button id="cancelar" style="
        background:#ccc;
        padding:10px;
        border:none;
        border-radius:7px;
        cursor:pointer;
        flex:1;
      ">Cancelar</button>
    </div>
  </div>
`;

document.body.appendChild(modal);

const clienteInput = modal.querySelector("#cliente");
const funcionarioInput = modal.querySelector("#funcionario");
const dataInput = modal.querySelector("#data");
const pagamentoInput = modal.querySelector("#pagamento");
const btnSalvar = modal.querySelector("#salvar");
const btnCancelar = modal.querySelector("#cancelar");
const tituloModal = modal.querySelector("#tituloModal");

function atualizarTotal() {
  const linhas = tabela.querySelectorAll("tr").length;
  totalEl.innerText = `Total: ${linhas}`;
}

function abrirModal(editando = false) {
  modoEdicao = editando;
  modal.style.display = "flex";
  if (!editando) {
    tituloModal.textContent = "Nova venda";
    clienteInput.value = "";
    funcionarioInput.value = "";
    dataInput.value = "";
    pagamentoInput.value = "";
  } else {
    tituloModal.textContent = "Editar venda";
  }
}

function fecharModal() {
  modal.style.display = "none";
  modoEdicao = false;
  linhaEditando = null;
}

tabela.addEventListener("click", (e) => {
  const el = e.target;

  if (el.classList.contains("btExcluir")) {
    const tr = el.closest("tr");
    if (tr) {
      tr.remove();
      atualizarTotal();
    }
    return;
  }

  if (el.classList.contains("btEditar")) {
    const tr = el.closest("tr");
    if (!tr) return;

    linhaEditando = tr;
    modoEdicao = true;

    const tds = tr.querySelectorAll("td");
    clienteInput.value = tds[0] ? tds[0].textContent.trim() : "";
    funcionarioInput.value = tds[1] ? tds[1].textContent.trim() : "";
    const rawData = tds[2] ? tds[2].textContent.trim() : "";
    if (rawData.includes("/")) {
      const parts = rawData.split("/");
      if (parts.length === 3) {
        dataInput.value = `${parts[2].padStart(4,'0')}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
      } else {
        dataInput.value = rawData;
      }
    } else {
      dataInput.value = rawData;
    }
    pagamentoInput.value = tds[3] ? tds[3].textContent.trim() : "";

    tituloModal.textContent = "Editar venda";
    abrirModal(true);
  }
});

btNovo.addEventListener("click", () => {
  linhaEditando = null;
  abrirModal(false);
});

btnCancelar.addEventListener("click", fecharModal);

btnSalvar.addEventListener("click", () => {
  const cliente = clienteInput.value.trim();
  const funcionario = funcionarioInput.value.trim();
  let data = dataInput.value.trim();
  const pagamento = pagamentoInput.value.trim();

  if (!cliente || !funcionario || !data || !pagamento) {
    alert("Preencha todos os campos!");
    return;
  }

  if (data.includes("-")) {
    const p = data.split("-");
    if (p.length === 3) data = `${p[2]}/${p[1]}/${p[0]}`;
  }

  if (modoEdicao && linhaEditando) {
    const tds = linhaEditando.querySelectorAll("td");
    if (tds[0]) tds[0].textContent = cliente;
    if (tds[1]) tds[1].textContent = funcionario;
    if (tds[2]) tds[2].textContent = data;
    if (tds[3]) tds[3].textContent = pagamento;
  } else {
    const nova = document.createElement("tr");
    nova.innerHTML = `
      <td>${cliente}</td>
      <td>${funcionario}</td>
      <td>${data}</td>
      <td>${pagamento}</td>
      <td>
        <button class="btEditar">Editar</button>
        <button class="btExcluir">Excluir</button>
      </td>
    `;
    tabela.appendChild(nova);
  }

  atualizarTotal();
  fecharModal();
});

inputBusca.addEventListener("input", () => {
  const termo = inputBusca.value.toLowerCase();
  tabela.querySelectorAll("tr").forEach((linha) => {
    const texto = linha.innerText.toLowerCase();
    linha.style.display = texto.includes(termo) ? "" : "none";
  });
});

window.addEventListener("load", () => {
  atualizarTotal();
});
