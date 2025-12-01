const inputBusca = document.querySelector(".topoFuncionarios input");
const btNovo = document.querySelector(".topoFuncionarios button");
const lista = document.querySelector(".areaMiniCards");
const totalEl = document.querySelector(".total");

let linhaEditando = null;
let imagemTempDataURL = "";

function ddmmyyyyParaISO(ddmmyyyy) {
  if (!ddmmyyyy) return "";
  const parts = ddmmyyyy.split("/");
  if (parts.length !== 3) return ddmmyyyy;
  return `${parts[2].padStart(4,"0")}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
}
function isoParaDDMMYYYY(iso) {
  if (!iso) return "";
  const p = iso.split("-");
  if (p.length !== 3) return iso;
  return `${p[2].padStart(2,"0")}/${p[1].padStart(2,"0")}/${p[0].padStart(4,"0")}`;
}

function garantirClassesEBotoesIniciais() {
  document.querySelectorAll(".miniCard").forEach(card => {
    const bts = card.querySelector(".btsFuncionarios");
    if (!bts) return;
    const buttons = bts.querySelectorAll("button");
    if (buttons.length >= 1 && buttons[0].classList.contains("btEditar")) {
      return;
    }
    if (buttons[0]) buttons[0].classList.add("btEditar");
    if (buttons[1]) buttons[1].classList.add("btExcluir");

    const imgWrap = card.querySelector(".imgFuncionarios");
    if (imgWrap) {
      let img = imgWrap.querySelector("img");
      if (!img) {
        img = document.createElement("img");
        img.src = "/imagens/user.png";
        img.alt = "Funcionário";
        imgWrap.appendChild(img);
      }
    }
  });
}

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
    z-index: 9999;
`;
modal.innerHTML = `
  <div class="janela" style="
      background: white;
      padding: 22px;
      border-radius: 15px;
      width: 420px;
      max-width: 95%;
      display: flex;
      flex-direction: column;
      gap: 10px;
  ">
    <h2 id="tituloModal">Novo Funcionário</h2>

    <label style="font-weight:700">Foto (upload ou URL)</label>
    <div style="display:flex; gap:8px; align-items:center;">
      <div style="width:100px; height:100px; border:1px solid #ddd; display:flex; align-items:center; justify-content:center; overflow:hidden; border-radius:8px;">
        <img id="previewImg" src="/imagens/user.png" alt="preview" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
        <input id="fotoFile" type="file" accept="image/*" />
        <input id="fotoUrl" placeholder="Colar URL da imagem (opcional)" />
      </div>
    </div>

    <input id="nome" placeholder="Nome">
    <input id="cargo" placeholder="Cargo / Função">
    <input id="salario" placeholder="Salário (ex: R$ 2.500,00)">
    <input id="inicio" type="date" placeholder="Data de início">
    <input id="turno" placeholder="Turno (Manhã / Tarde / Noite)">

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

const previewImg = modal.querySelector("#previewImg");
const fotoFile = modal.querySelector("#fotoFile");
const fotoUrl = modal.querySelector("#fotoUrl");
const nomeInput = modal.querySelector("#nome");
const cargoInput = modal.querySelector("#cargo");
const salarioInput = modal.querySelector("#salario");
const inicioInput = modal.querySelector("#inicio");
const turnoInput = modal.querySelector("#turno");
const btnSalvar = modal.querySelector("#salvar");
const btnCancelar = modal.querySelector("#cancelar");
const tituloModal = modal.querySelector("#tituloModal");

fotoFile.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    imagemTempDataURL = reader.result;
    previewImg.src = imagemTempDataURL;
    fotoUrl.value = "";
  };
  reader.readAsDataURL(file);
});

fotoUrl.addEventListener("input", () => {
  const url = fotoUrl.value.trim();
  if (url) {
    previewImg.src = url;
    imagemTempDataURL = "";
    fotoFile.value = "";
  }
});

function abrirModal(editando = false, cardElement = null) {
  linhaEditando = editando ? cardElement : null;
  modal.style.display = "flex";

  if (!editando) {
    tituloModal.textContent = "Novo Funcionário";
    previewImg.src = "/imagens/user.png";
    fotoFile.value = "";
    fotoUrl.value = "";
    imagemTempDataURL = "";
    nomeInput.value = "";
    cargoInput.value = "";
    salarioInput.value = "";
    inicioInput.value = "";
    turnoInput.value = "";
  } else {
    tituloModal.textContent = "Editar Funcionário";
    const imgEl = cardElement.querySelector(".imgFuncionarios img");
    previewImg.src = imgEl ? imgEl.src : "/imagens/user.png";
    imagemTempDataURL = "";
    fotoFile.value = "";
    fotoUrl.value = "";

    const info = cardElement.querySelectorAll(".infoFuncionarios > div");
    const nome = info[0] ? info[0].querySelector("h1").innerText.trim() : "";
    const cargo = info[0] ? info[0].querySelector("h2").innerText.trim() : "";
    const salario = info[1] ? info[1].querySelector("h2").innerText.trim() : "";
    const inicio = info[2] ? info[2].querySelector("h2").innerText.trim() : "";
    const turno = info[3] ? info[3].querySelector("h2").innerText.trim() : "";

    nomeInput.value = nome;
    cargoInput.value = cargo;
    salarioInput.value = salario;
    inicioInput.value = ddmmyyyyParaISO(inicio);
    turnoInput.value = turno;
  }
}

function fecharModal() {
  modal.style.display = "none";
  linhaEditando = null;
  imagemTempDataURL = "";
  fotoFile.value = "";
  fotoUrl.value = "";
}

function atualizarTotal() {
  const count = document.querySelectorAll(".miniCard").length;
  totalEl.textContent = `Total: ${count}`;
}

lista.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const card = btn.closest(".miniCard");
  if (!card) return;

  if (btn.classList.contains("btExcluir")) {
    if (confirm("Deseja realmente excluir este funcionário?")) {
      card.remove();
      atualizarTotal();
    }
    return;
  }

  if (btn.classList.contains("btEditar")) {
    abrirModal(true, card);
    return;
  }
});

btNovo.addEventListener("click", () => abrirModal(false, null));

btnCancelar.addEventListener("click", fecharModal);

btnSalvar.addEventListener("click", () => {
  const nome = nomeInput.value.trim();
  const cargo = cargoInput.value.trim();
  const salario = salarioInput.value.trim();
  let inicio = inicioInput.value.trim();
  const turno = turnoInput.value.trim();

  if (!nome) {
    alert("Nome é obrigatório.");
    return;
  }

  if (inicio) inicio = isoParaDDMMYYYY(inicio);

  const imgSrc = imagemTempDataURL ? imagemTempDataURL : previewImg.src || "/imagens/user.png";

  if (linhaEditando) {
    const imgEl = linhaEditando.querySelector(".imgFuncionarios img");
    if (imgEl) imgEl.src = imgSrc;

    const info = linhaEditando.querySelectorAll(".infoFuncionarios > div");
    if (info[0]) {
      info[0].querySelector("h1").textContent = nome;
      info[0].querySelector("h2").textContent = cargo;
    }
    if (info[1]) info[1].querySelector("h2").textContent = salario;
    if (info[2]) info[2].querySelector("h2").textContent = inicio;
    if (info[3]) info[3].querySelector("h2").textContent = turno;

    fecharModal();
    atualizarTotal();
    return;
  }

  const card = document.createElement("div");
  card.classList.add("miniCard");

  card.innerHTML = `
    <div class="colunaEsquerda">
      <div class="imgFuncionarios">
        <img src="${imgSrc}" alt="Funcionário">
      </div>
      <div class="infoFuncionarios">
        <div>
          <h1>${nome}</h1>
          <h2>${cargo}</h2>
        </div>
        <div>
          <h1>Salário</h1>
          <h2>${salario}</h2>
        </div>
        <div>
          <h1>Início</h1>
          <h2>${inicio}</h2>
        </div>
        <div>
          <h1>Turno</h1>
          <h2>${turno}</h2>
        </div>
      </div>
    </div>
    <div class="btsFuncionarios">
      <button class="btEditar">🖉</button>
      <button class="btExcluir">🗑</button>
    </div>
  `;

  lista.appendChild(card);
  fecharModal();
  atualizarTotal();
});

inputBusca.addEventListener("input", () => {
  const termo = inputBusca.value.toLowerCase();
  document.querySelectorAll(".miniCard").forEach(card => {
    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(termo) ? "flex" : "none";
  });
});

(function init() {
  garantirClassesEBotoesIniciais();
  atualizarTotal();

  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });
})();
