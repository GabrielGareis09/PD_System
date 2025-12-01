const selectTipo = document.querySelector("#opcoes");
const inputFuncionario = document.querySelector(".areaInputs input");
const textareaDescricao = document.querySelector(".areaInputs textarea");

const btnEnviar = document.querySelector(".btnEnviar");
const btnLimpar = document.querySelector(".btnLimpar");

function mostrarMensagem(msg) {
    let caixa = document.createElement("div");
    caixa.textContent = msg;

    caixa.style.position = "fixed";
    caixa.style.top = "20px";
    caixa.style.right = "20px";
    caixa.style.background = "#5e2c2f";
    caixa.style.color = "white";
    caixa.style.padding = "15px 20px";
    caixa.style.borderRadius = "10px";
    caixa.style.fontSize = "16px";
    caixa.style.fontWeight = "700";
    caixa.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    caixa.style.zIndex = "9999";
    caixa.style.opacity = "0";
    caixa.style.transition = "0.3s";

    document.body.appendChild(caixa);

    setTimeout(() => caixa.style.opacity = "1", 50);

    setTimeout(() => {
        caixa.style.opacity = "0";
        setTimeout(() => caixa.remove(), 300);
    }, 2500);
}

function limparCampos() {
    selectTipo.selectedIndex = 0;
    inputFuncionario.value = "";
    textareaDescricao.value = "";
}

btnEnviar.addEventListener("click", () => {

    if (
        inputFuncionario.value.trim() === "" ||
        textareaDescricao.value.trim() === ""
    ) {
        mostrarMensagem("Preencha todos os campos antes de enviar.");
        return;
    }

    mostrarMensagem("Enviado com sucesso!");

    limparCampos();
});

btnLimpar.addEventListener("click", () => {
    limparCampos();
    mostrarMensagem("Campos limpos!");
});