const inputBusca = document.querySelector(".topoProducao input");
const areaCards = document.querySelector(".areaMiniCards");

const selectProducao = document.querySelector("#opcoes");
const inputQtd = document.querySelector('input[type="number"]');
const inputData = document.querySelector('input[type="date"]');

const btnAdd = document.querySelector(".btnADD");
const btnLimpar = document.querySelector(".btnLimpar");

inputBusca.addEventListener("input", () => {
    const termo = inputBusca.value.toLowerCase();
    const cards = document.querySelectorAll(".miniCard");

    cards.forEach(card => {
        const texto = card.innerText.toLowerCase();
        card.style.display = texto.includes(termo) ? "flex" : "none";
    });
});

function criarCard(produto, quantidade, data) {
    const card = document.createElement("div");
    card.classList.add("miniCard");

    card.innerHTML = `
        <div class="colunaEsquerda">
            <div>
                <div class="numCard">${quantidade}</div>
            </div>
            <div class="txtCard">
                <h1>${produto}</h1>
                <h2>${quantidade} unidades — ${data.split("-").reverse().join("/")}</h2>
            </div>
        </div>

        <div class="colunaDireita">
            <button class="btnRemover">Remover</button>
        </div>
    `;

    return card;
}

btnAdd.addEventListener("click", () => {
    const produto = selectProducao.options[selectProducao.selectedIndex].text;
    const quantidade = inputQtd.value;
    const data = inputData.value;

    if (quantidade === "" || data === "") {
        alert("Preencha quantidade e data!");
        return;
    }

    const novoCard = criarCard(produto, quantidade, data);
    areaCards.appendChild(novoCard);
});

btnLimpar.addEventListener("click", () => {
    inputQtd.value = "";
    inputData.value = "";
    selectProducao.selectedIndex = 0;
});

areaCards.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnRemover") || e.target.innerText === "Remover") {
        e.target.closest(".miniCard").remove();
    }
});
