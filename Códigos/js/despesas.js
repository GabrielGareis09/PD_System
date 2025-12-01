const inputBusca = document.querySelector(".topoDespesas input");
const tabela = document.querySelector("tbody");
const totalEl = document.querySelector(".totalTabela h2");

const btAdd = document.querySelector(".add");
const btLimpar = document.querySelector(".limpar");

const inputDescricao = document.querySelector(".descricao input");
const selectTipo = document.querySelector("#opcoes");
const inputData = document.querySelector(".data input");
const inputValor = document.querySelector("#preco");

let modoEdicao = false;
let trEditando = null;

function atualizarTotal() {
    let total = 0;

    tabela.querySelectorAll("tr").forEach(tr => {
        const valorTd = tr.children[3].textContent.replace("R$", "").replace(".", "").replace(",", ".");
        total += parseFloat(valorTd);
    });

    totalEl.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

function limparCampos() {
    inputDescricao.value = "";
    selectTipo.selectedIndex = 0;
    inputData.value = "";
    inputValor.value = "0.00";
    modoEdicao = false;
    trEditando = null;
}

btAdd.addEventListener("click", () => {
    const descricao = inputDescricao.value.trim() || "—";
    const tipo = selectTipo.options[selectTipo.selectedIndex].textContent;
    const data = inputData.value;
    const valor = parseFloat(inputValor.value).toFixed(2);

    if (!data) {
        alert("Escolha uma data!");
        return;
    }

    const dataFormatada = data.split("-").reverse().join("/");

    if (modoEdicao && trEditando) {
        trEditando.children[0].textContent = descricao;
        trEditando.children[1].textContent = tipo;
        trEditando.children[2].textContent = dataFormatada;
        trEditando.children[3].textContent = valor.replace(".", ",");

        modoEdicao = false;
        trEditando = null;
    } else {
        const novaLinha = document.createElement("tr");

        novaLinha.innerHTML = `
            <td>${descricao}</td>
            <td>${tipo}</td>
            <td>${dataFormatada}</td>
            <td>${valor.replace(".", ",")}</td>
        `;

        adicionarEventosLinha(novaLinha);
        tabela.appendChild(novaLinha);
    }

    atualizarTotal();
    limparCampos();
});

btLimpar.addEventListener("click", limparCampos);

inputBusca.addEventListener("input", () => {
    const termo = inputBusca.value.toLowerCase();

    tabela.querySelectorAll("tr").forEach(tr => {
        const texto = tr.textContent.toLowerCase();
        tr.style.display = texto.includes(termo) ? "" : "none";
    });
});

function adicionarEventosLinha(tr) {
    tr.addEventListener("click", () => {
        if (modoEdicao === false) {
            modoEdicao = true;
            trEditando = tr;

            inputDescricao.value = tr.children[0].textContent;
            selectTipo.value = selectTipo.options[0].value;
            inputData.value = tr.children[2].textContent.split("/").reverse().join("-");
            inputValor.value = tr.children[3].textContent.replace(",", ".");
        }
    });

    tr.addEventListener("contextmenu", (e) => {
        e.preventDefault();

        if (confirm("Deseja excluir esta despesa?")) {
            tr.remove();
            atualizarTotal();
        }
    });
}

tabela.querySelectorAll("tr").forEach(tr => adicionarEventosLinha(tr));

atualizarTotal();
