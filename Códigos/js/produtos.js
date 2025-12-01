const inputBusca = document.querySelector(".topoProdutos input");
const btNovo = document.querySelector(".topoProdutos button");
const areaCards = document.querySelector(".areaMiniCards");
const topoCard = document.querySelector(".cardProdutos .topoCard");

let cardEditando = null;
let imagemTempDataURL = "";

let totalEl = topoCard.querySelector(".total");
if (!totalEl) {
  totalEl = document.createElement("div");
  totalEl.classList.add("total");
  totalEl.style.marginLeft = "auto";
  topoCard.appendChild(totalEl);
}

function parsePreco(str) {
  if (!str && str !== 0) return 0;
  let s = String(str).trim();
  s = s.replace("R$", "").replace(/\s/g, "");
  s = s.replace(/\./g, "").replace(/,/g, ".");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}
function formatPreco(num) {
  return "R$ " + Number(num).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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
  z-index:9999;
`;
modal.innerHTML = `
  <div class="janela" style="
    background:white;
    padding:20px;
    border-radius:12px;
    width:380px;
    max-width:95%;
    display:flex;
    flex-direction:column;
    gap:10px;
  ">
    <h2 id="tituloModal">Novo Produto</h2>

    <label style="font-weight:700">Imagem (upload ou URL)</label>
    <div style="display:flex; gap:8px; align-items:center;">
      <div style="width:96px; height:96px; border:1px solid #ddd; display:flex; align-items:center; justify-content:center; overflow:hidden; border-radius:8px;">
        <img id="previewProdImg" src="/imagens/semFoto.png" alt="preview" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
        <input id="produtoFile" type="file" accept="image/*" />
        <input id="produtoUrl" placeholder="Colar URL da imagem (opcional)"/>
      </div>
    </div>

    <input id="nomeProd" placeholder="Nome do produto">
    <input id="catProd" placeholder="Categoria">
    <input id="precoProd" placeholder="Preço (ex: 3,50)">
    <input id="estoqueProd" placeholder="Quantidade">
    <input id="unidadeProd" placeholder="Unidade (ex: unidade, kg)">

    <div style="display:flex; gap:8px; margin-top:6px;">
      <button id="salvarProd" style="background:#5e2c2f; color:#d8bfa5; padding:10px; border:none; border-radius:7px; cursor:pointer; flex:1;">Salvar</button>
      <button id="cancelarProd" style="background:#ccc; padding:10px; border:none; border-radius:7px; cursor:pointer; flex:1;">Cancelar</button>
    </div>
  </div>
`;
document.body.appendChild(modal);

const previewProdImg = modal.querySelector("#previewProdImg");
const produtoFile = modal.querySelector("#produtoFile");
const produtoUrl = modal.querySelector("#produtoUrl");
const nomeProdInput = modal.querySelector("#nomeProd");
const catProdInput = modal.querySelector("#catProd");
const precoProdInput = modal.querySelector("#precoProd");
const estoqueProdInput = modal.querySelector("#estoqueProd");
const unidadeProdInput = modal.querySelector("#unidadeProd");
const btnSalvarProd = modal.querySelector("#salvarProd");
const btnCancelarProd = modal.querySelector("#cancelarProd");
const tituloModal = modal.querySelector("#tituloModal");

produtoFile.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    imagemTempDataURL = reader.result;
    previewProdImg.src = imagemTempDataURL;
    produtoUrl.value = "";
  };
  reader.readAsDataURL(file);
});
produtoUrl.addEventListener("input", () => {
  const u = produtoUrl.value.trim();
  if (u) {
    previewProdImg.src = u;
    imagemTempDataURL = "";
    produtoFile.value = "";
  }
});

function abrirModalProduto(editando = false, card = null) {
  cardEditando = editando ? card : null;
  modal.style.display = "flex";
  if (!editando) {
    tituloModal.textContent = "Novo Produto";
    previewProdImg.src = "/imagens/semFoto.png";
    produtoFile.value = "";
    produtoUrl.value = "";
    imagemTempDataURL = "";
    nomeProdInput.value = "";
    catProdInput.value = "";
    precoProdInput.value = "";
    estoqueProdInput.value = "";
    unidadeProdInput.value = "";
  } else {
    tituloModal.textContent = "Editar Produto";
    const imgEl = card.querySelector(".imgProdutos img");
    previewProdImg.src = imgEl ? imgEl.src : "/imagens/semFoto.png";
    produtoFile.value = "";
    produtoUrl.value = "";
    imagemTempDataURL = "";

    const txt = card.querySelector(".txtProdutos");
    const h1 = txt.querySelector("h1") ? txt.querySelector("h1").innerText.trim() : "";
    const h2s = txt.querySelectorAll("h2");
    const categoria = h2s[0] ? h2s[0].innerText.trim() : "";
    const preco = h2s[1] ? h2s[1].innerText.replace("R$", "").trim() : "";
    const estoque = h2s[2] ? h2s[2].innerText.trim() : "";
    const unidade = h2s[3] ? h2s[3].innerText.trim() : "";

    nomeProdInput.value = h1;
    catProdInput.value = categoria;
    precoProdInput.value = preco ? String(parsePreco(preco).toFixed(2)).replace(".", ",") : "";
    estoqueProdInput.value = estoque;
    unidadeProdInput.value = unidade;
  }
}

function fecharModalProduto() {
  modal.style.display = "none";
  cardEditando = null;
  imagemTempDataURL = "";
  produtoFile.value = "";
  produtoUrl.value = "";
}

btnSalvarProd.addEventListener("click", () => {
  const nome = nomeProdInput.value.trim();
  const categoria = catProdInput.value.trim();
  let precoRaw = precoProdInput.value.trim();
  const estoque = estoqueProdInput.value.trim();
  const unidade = unidadeProdInput.value.trim();

  if (!nome) return alert("Preencha o nome do produto.");
  if (!categoria) return alert("Preencha a categoria.");
  if (!precoRaw) return alert("Preencha o preço.");
  if (!estoque) return alert("Preencha a quantidade.");
  if (!unidade) return alert("Preencha a unidade.");

  precoRaw = precoRaw.replace(/\s/g, "").replace(/\./g, "").replace(/,/g, ".");
  const precoNum = parseFloat(precoRaw);
  if (isNaN(precoNum)) return alert("Preço inválido.");

  const precoFormat = formatPreco(precoNum);
  const imgSrc = imagemTempDataURL ? imagemTempDataURL : (previewProdImg.src || "/imagens/semFoto.png");

  if (cardEditando) {
    const imgEl = cardEditando.querySelector(".imgProdutos img");
    if (imgEl) imgEl.src = imgSrc;

    const txt = cardEditando.querySelector(".txtProdutos");
    txt.querySelector("h1").textContent = nome;
    const h2s = txt.querySelectorAll("h2");
    if (h2s[0]) h2s[0].textContent = categoria;
    if (h2s[1]) h2s[1].textContent = precoFormat;
    if (h2s[2]) h2s[2].textContent = estoque;
    if (h2s[3]) h2s[3].textContent = unidade;

    fecharModalProduto();
    atualizarTotalProdutos();
    return;
  }

  const newCard = document.createElement("div");
  newCard.classList.add("miniCards");
  newCard.innerHTML = `
    <div class="imgProdutos">
      <img src="${imgSrc}" alt="${nome}">
    </div>
    <div class="infoProdutos">
      <div class="txtProdutos">
        <h1>${nome}</h1>
        <h2>${categoria}</h2>
        <h2>${precoFormat}</h2>
        <h2>${estoque}</h2>
        <h2>${unidade}</h2>
      </div>
      <div class="btsProdutos">
        <button class="btEditar">🖉</button>
        <button class="btExcluir">🗑</button>
      </div>
    </div>
  `;
  areaCards.appendChild(newCard);
  atualizarTotalProdutos();
  fecharModalProduto();
});

areaCards.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const card = btn.closest(".miniCards");
  if (!card) return;

  if (!btn.classList.contains("btEditar") && !btn.classList.contains("btExcluir")) {
    const parent = btn.closest(".btsProdutos");
    const buttons = parent ? parent.querySelectorAll("button") : [];
    if (buttons.length >= 1) buttons[0].classList.add("btEditar");
    if (buttons.length >= 2) buttons[1].classList.add("btExcluir");
  }

  if (btn.classList.contains("btExcluir")) {
    if (confirm("Deseja realmente excluir este produto?")) {
      card.remove();
      atualizarTotalProdutos();
    }
    return;
  }

  if (btn.classList.contains("btEditar")) {
    abrirModalProduto(true, card);
    return;
  }
});

inputBusca.addEventListener("input", () => {
  const termo = inputBusca.value.toLowerCase();
  document.querySelectorAll(".miniCards").forEach(card => {
    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(termo) ? "flex" : "none";
  });
});

function atualizarTotalProdutos() {
  const count = document.querySelectorAll(".miniCards").length;
  totalEl.textContent = `Total: ${count}`;
}

(function init() {
  document.querySelectorAll(".miniCards").forEach(card => {
    const bts = card.querySelector(".btsProdutos");
    if (bts) {
      const buttons = bts.querySelectorAll("button");
      if (buttons[0] && !buttons[0].classList.contains("btEditar")) buttons[0].classList.add("btEditar");
      if (buttons[1] && !buttons[1].classList.contains("btExcluir")) buttons[1].classList.add("btExcluir");
    }
    const imgWrap = card.querySelector(".imgProdutos");
    if (imgWrap) {
      const img = imgWrap.querySelector("img");
      if (!img) {
        const el = document.createElement("img");
        el.src = "/imagens/semFoto.png";
        el.alt = "Produto";
        imgWrap.appendChild(el);
      }
    }
  });

  if (btNovo) {
    btNovo.addEventListener("click", () => {
      abrirModalProduto(false, null);
    });
  }

  atualizarTotalProdutos();

  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModalProduto();
  });
})();
