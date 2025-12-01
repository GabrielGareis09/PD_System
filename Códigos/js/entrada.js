const senhaInput = document.getElementById("senha");
const toggle = document.getElementById("toggleSenha");
const botaoEntrar = document.getElementById("entrarBtn");

const senhaCorreta = "pdsystem123";

toggle.addEventListener("click", () => {
    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        toggle.src = "/imagens/olhoAberto.svg";
    } else {
        senhaInput.type = "password";
        toggle.src = "/imagens/olhoFechado.svg";
    }
});

botaoEntrar.addEventListener("click", () => {
    if (senhaInput.value === senhaCorreta) {
        window.location.href = "/html/clientes.html";
    } else {
        alert("SENHA: pdsystem123  -  coloque essa senha para entrar no sistema!");
    }
});
