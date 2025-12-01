const inputBusca = document.querySelector(".topoCompras input");
const tabela = document.querySelector("tbody");
const totalEl = document.querySelector(".total");
const btNovo = document.querySelector(".topoCompras button");

let modoEdicao = false;
let linhaEditando = null;

const modal = document.createElement("div");
modal.classList.add("modal");
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
    padding: 30px;
    border-radius: 15px;
    width: 360px;
    display:flex;
    flex-direction:column;
    gap:10px;
  ">
    <h2 id="tituloModal">Nova Compra</h2>

    <input id="forne" placeholder="Fornecedor">
    <input id="data" placeholder="Data">
    <input id="valor" placeholder="Valor (ex: 1250,00)">

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

const forneInput = modal.querySelector("#forne");
const dataInput = modal.querySelector("#data");
const valorInput = modal.querySelector("#valor");
const btnSalvar = modal.querySelector("#salvar");
const btnCancelar = modal.querySelector("#cancelar");
const tituloModal = modal.querySelector("#tituloModal");

function parseBRL(str) {
  if (!str && str !== 0) return 0;
  const s = String(str).trim();
  let cleaned = s.replace(/R\$|\s/g, "");
  cleaned = cleaned.replace(/\./g, "").replace(/,/g, ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function formatBRL(num) {
  return "R$ " + Number(num).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function atualizarTotal() {
  let soma = 0;
  const linhas = tabela.querySelectorAll("tr");
  linhas.forEach(linha => {
    const tdValor = linha.querySelector("td:nth-child(3)");
    if (!tdValor) return;
    soma += parseBRL(tdValor.innerText);
  });
  totalEl.textContent = "Valor total: " + formatBRL(soma).replace("R$ ", "R$ ");
}

function abrirModal(editando = false) {
  modoEdicao = editando;
  modal.style.display = "flex";
  if (!editando) {
    tituloModal.textContent = "Nova Compra";
    forneInput.value = "";
    dataInput.value = "";
    valorInput.value = "";
  } else {
    tituloModal.textContent = "Editar Compra";
  }
}

function fecharModal() {
  modal.style.display = "none";
  modoEdicao = false;
  linhaEditando = null;
}

function normalizarValorInput(str) {
  let n = parseBRL(str);
  return n;
}

tabela.addEventListener("click", (e) => {
  const btn = e.target;
  if (btn.classList.contains("btExcluir")) {
    const tr = btn.closest("tr");
    if (tr) {
      tr.remove();
      atualizarTotal();
    }
    return;
  }

  if (btn.classList.contains("btEditar")) {
    const tr = btn.closest("tr");
    if (!tr) return;

    linhaEditando = tr;
    modoEdicao = true;

    const tds = tr.querySelectorAll("td");
    forneInput.value = tds[0] ? tds[0].textContent.trim() : "";
    dataInput.value = tds[1] ? tds[1].textContent.trim() : "";
    const rawValor = tds[2] ? tds[2].textContent.trim() : "";
    const num = parseBRL(rawValor);
    valorInput.value = num ? String(num.toFixed(2)).replace(".", ",") : "";

    tituloModal.textContent = "Editar Compra";
    abrirModal(true);
  }
});

btNovo.addEventListener("click", () => {
  linhaEditando = null;
  abrirModal(false);
});

btnCancelar.addEventListener("click", fecharModal);

btnSalvar.addEventListener("click", () => {
  const forne = forneInput.value.trim();
  const data = dataInput.value.trim();
  const valorTexto = valorInput.value.trim();

  if (!forne) {
    alert("Fornecedor é obrigatório.");
    return;
  }
  if (!data) {
    alert("Data é obrigatória.");
    return;
  }
  if (!valorTexto) {
    alert("Valor é obrigatório.");
    return;
  }

  const numValor = normalizarValorInput(valorTexto);
  if (isNaN(numValor)) {
    alert("Valor inválido. Use um número (ex: 1250,00).");
    return;
  }
  const valorFormatado = formatBRL(numValor);

  if (modoEdicao && linhaEditando) {
    const tds = linhaEditando.querySelectorAll("td");
    if (tds[0]) tds[0].textContent = forne;
    if (tds[1]) tds[1].textContent = data;
    if (tds[2]) tds[2].textContent = valorFormatado;
  } else {
    const nova = document.createElement("tr");
    nova.innerHTML = `
      <td>${forne}</td>
      <td>${data}</td>
      <td>${valorFormatado}</td>
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
  tabela.querySelectorAll("tr").forEach(linha => {
    const texto = linha.innerText.toLowerCase();
    linha.style.display = texto.includes(termo) ? "" : "none";
  });
});

window.addEventListener("load", () => {
  tabela.querySelectorAll("tr").forEach(tr => {
  });

  atualizarTotal();
});
