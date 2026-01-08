var STORAGE_KEY = "controle-custos";
// =======================
// CONVERSÃO
// =======================
function converterParaBase(qtd, unidade) {
    switch (unidade) {
        case "kg":
            return qtd * 1000;
        case "g":
        case "ml":
        case "un":
        default:
            return qtd;
    }
}
// =======================
// CÁLCULOS DE CUSTO
// =======================
function custoPorUnidade(produto) {
    var base = converterParaBase(produto.quantidadeTotal, produto.unidade);
    return produto.precoTotal / base;
}
function custoPorUso(produto, consumo) {
    return custoPorUnidade(produto) * consumo.quantidadePorUso;
}
function custoDiario(produto, consumo) {
    return custoPorUso(produto, consumo) * consumo.usosPorDia;
}
function custoMensal(produto, consumo) {
    return custoDiario(produto, consumo) * 30;
}
// =======================
// MÉTRICAS
// =======================
function usosTotais(produto, consumo) {
    var base = converterParaBase(produto.quantidadeTotal, produto.unidade);
    return base / consumo.quantidadePorUso;
}
function diasDeDuracao(produto, consumo) {
    return usosTotais(produto, consumo) / consumo.usosPorDia;
}
function usosPorMes(consumo) {
    return consumo.usosPorDia * 30;
}
function produtosPorMes(produto, consumo) {
    return 30 / diasDeDuracao(produto, consumo);
}
// =======================
// STORAGE
// =======================
function carregarLista() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
function salvarNaLista(dados) {
    var lista = carregarLista();
    lista.push(dados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}
// =======================
// DOM
// =======================
var resultado = document.getElementById("resultado");
function lerProduto() {
    return {
        nome: document.getElementById("nome").value,
        precoTotal: Number(document.getElementById("preco").value),
        quantidadeTotal: Number(document.getElementById("quantidadeTotal").value),
        unidade: document.getElementById("unidade").value,
    };
}
function lerConsumo() {
    var quantidadePorUso = Number(document.getElementById("quantidadePorUso").value);
    var tipoConsumo = document.getElementById("tipoConsumo").value;
    var usos = Number(document.getElementById("usos").value);
    var usosPorDia = tipoConsumo === "mes"
        ? usos / 30
        : usos;
    return {
        quantidadePorUso: quantidadePorUso,
        usosPorDia: usosPorDia,
    };
}
function mostrarResultado(produto, consumo) {
    var diario = custoDiario(produto, consumo);
    var mensal = custoMensal(produto, consumo);
    var unidadeLabel = produto.unidade === "un"
        ? "unidade(s)"
        : produto.unidade;
    resultado.innerHTML = "\n    <div style=\"display:flex; flex-direction:column; gap:10px;\">\n      \n      <div>\n        <strong style=\"font-size:18px;\">".concat(produto.nome, "</strong>\n        <span style=\"color:#555; font-size:13px;\">\n          (").concat(unidadeLabel, ")\n        </span>\n      </div>\n\n      <hr/>\n\n      <div>\n        <strong>\uD83D\uDCB0 Custos</strong><br/>\n        \u2022 Custo por uso: <strong>R$ ").concat(custoPorUso(produto, consumo).toFixed(2), "</strong><br/>\n        \u2022 Custo di\u00E1rio: <strong>R$ ").concat(diario.toFixed(2), "</strong><br/>\n        \u2022 Custo mensal: <strong>R$ ").concat(mensal.toFixed(2), "</strong>\n      </div>\n\n      <div>\n        <strong>\uD83D\uDCE6 Consumo</strong><br/>\n        \u2022 Usos totais do produto: <strong>").concat(usosTotais(produto, consumo).toFixed(0), "</strong><br/>\n        \u2022 Dura\u00E7\u00E3o estimada: <strong>").concat(diasDeDuracao(produto, consumo).toFixed(1), " dias</strong><br/>\n        \u2022 Usos por m\u00EAs (estimado): <strong>").concat(usosPorMes(consumo).toFixed(0), "</strong><br/>\n        \u2022 Produtos consumidos por m\u00EAs: <strong>").concat(produtosPorMes(produto, consumo).toFixed(2), "</strong>\n      </div>\n\n    </div>\n  ");
}
function renderTabela() {
    var tbody = document.querySelector("#tabela tbody");
    var lista = carregarLista();
    tbody.innerHTML = "";
    lista.forEach(function (_a) {
        var produto = _a.produto, consumo = _a.consumo;
        tbody.innerHTML += "\n      <tr>\n        <td>".concat(produto.nome, "</td>\n        <td>R$ ").concat(custoDiario(produto, consumo).toFixed(2), "</td>\n        <td>R$ ").concat(custoMensal(produto, consumo).toFixed(2), "</td>\n      </tr>\n    ");
    });
}
// =======================
// EVENTOS
// =======================
document.getElementById("calcular")
    .addEventListener("click", function () {
    mostrarResultado(lerProduto(), lerConsumo());
});
document.getElementById("salvar")
    .addEventListener("click", function () {
    salvarNaLista({ produto: lerProduto(), consumo: lerConsumo() });
    renderTabela();
});
// =======================
// INIT
// =======================
renderTabela();
