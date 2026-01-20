"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function converterParaBase(qtd, unidade) {
    switch (unidade.toLowerCase()) {
        case "kg":
        case "l":
            return qtd * 1000;
        default:
            return qtd;
    }
}
function calcular() {
    // Captura exata dos IDs do HTML
    const elSalario = document.getElementById("salario");
    const elNome = document.getElementById("nome");
    const elPreco = document.getElementById("preco");
    const elQtdTotal = document.getElementById("quantidadeTotal");
    const elUnidade = document.getElementById("unidade");
    const elQtdUso = document.getElementById("quantidadePorUso");
    const elUsos = document.getElementById("usos");
    const resDiv = document.getElementById("resultado");
    if (!resDiv)
        return;
    // Conversão de valores
    const salario = parseFloat(elSalario.value) || 0;
    const nome = elNome.value || "Produto";
    const preco = parseFloat(elPreco.value) || 0;
    const qtdTotal = parseFloat(elQtdTotal.value) || 0;
    const unidade = elUnidade.value;
    const qtdUso = parseFloat(elQtdUso.value) || 0;
    const usosDia = parseFloat(elUsos.value) || 0;
    // Verificação básica para não dividir por zero
    if (preco === 0 || qtdTotal === 0 || qtdUso === 0) {
        resDiv.innerHTML = `<p class="text-rose-500 text-center font-bold p-4">Preencha os valores de preço e quantidade!</p>`;
        return;
    }
    // Lógica Matemática
    const baseTotal = converterParaBase(qtdTotal, unidade);
    const precoPorUnidadeBase = preco / baseTotal;
    const custoPorUso = precoPorUnidadeBase * qtdUso;
    const custoMensal = custoPorUso * usosDia * 30;
    const duracaoDias = baseTotal / (qtdUso * usosDia);
    const impactoSalarial = salario > 0 ? (custoMensal / salario) * 100 : 0;
    // Mostra o resultado
    resDiv.innerHTML = `
    <div class="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl mt-6 animate-in slide-in-from-bottom-4 duration-500">
        <div class="relative z-10">
            <div class="flex justify-between items-center mb-6">
                <span class="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">Análise de Impacto</span>
                <span class="text-slate-500 text-xs font-bold uppercase tracking-widest">${nome}</span>
            </div>
            
            <div class="text-center mb-8">
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Custo Total Mensal</p>
                <h2 class="text-5xl font-black text-white leading-none tracking-tight">R$ ${custoMensal.toFixed(2)}</h2>
                ${salario > 0 ? `<p class="text-emerald-400 text-sm font-bold mt-2">Representa ${impactoSalarial.toFixed(2)}% da sua renda</p>` : ''}
            </div>

            <div class="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div class="bg-white/5 p-4 rounded-2xl">
                    <p class="text-slate-500 text-[10px] uppercase font-black mb-1">Por Uso Individual</p>
                    <p class="text-xl font-bold text-indigo-300">R$ ${custoPorUso.toFixed(2)}</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl">
                    <p class="text-slate-500 text-[10px] uppercase font-black mb-1">O Pacote dura</p>
                    <p class="text-xl font-bold text-white">${duracaoDias.toFixed(0)} dias</p>
                </div>
            </div>

            <div class="mt-6 p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/30 flex items-center gap-3">
                <span class="text-xl">💡</span>
                <p class="text-[11px] text-slate-300 leading-relaxed">
                    Você gasta <strong>R$ ${(custoPorUso * usosDia).toFixed(2)} por dia</strong> com isso. No ano, o custo acumulado é de <strong>R$ ${(custoMensal * 12).toFixed(2)}</strong>.
                </p>
            </div>
        </div>
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
    </div>
  `;
}
// Escuta o clique no botão
document.getElementById("calcular")?.addEventListener("click", calcular);
//# sourceMappingURL=index.js.map