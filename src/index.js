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
    const salarioInput = document.getElementById("salario");
    const nomeInput = document.getElementById("nome");
    const precoInput = document.getElementById("preco");
    const qtdTotalInput = document.getElementById("quantidadeTotal");
    const unidadeSelect = document.getElementById("unidade");
    const qtdUsoInput = document.getElementById("quantidadePorUso");
    const usosInput = document.getElementById("usos");
    const resDiv = document.getElementById("resultado");
    if (!resDiv)
        return;
    const salario = Number(salarioInput.value) || 0;
    const nome = nomeInput.value || "Produto";
    const preco = Number(precoInput.value) || 0;
    const qtdTotal = Number(qtdTotalInput.value) || 1;
    const unidade = unidadeSelect.value;
    const qtdUso = Number(qtdUsoInput.value) || 0;
    const usosDia = Number(usosInput.value) || 0;
    // Cálculos
    const baseTotal = converterParaBase(qtdTotal, unidade);
    const precoUnitario = preco / baseTotal;
    const custoPorUso = precoUnitario * qtdUso;
    const custoMensal = custoPorUso * usosDia * 30;
    const duracaoDias = usosDia > 0 && qtdUso > 0 ? baseTotal / (qtdUso * usosDia) : 0;
    const impactoSalarial = salario > 0 ? (custoMensal / salario) * 100 : 0;
    resDiv.classList.remove("hidden");
    resDiv.innerHTML = `
    <div class="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
        <div class="relative z-10 text-center">
            <div class="flex justify-between items-center mb-6">
                <span class="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">Análise Financeira</span>
                <span class="text-slate-500 text-xs font-bold uppercase tracking-widest">${nome}</span>
            </div>
            
            <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Custo Total Mensal</p>
            <h2 class="text-5xl font-black text-white leading-none tracking-tight mb-2">
                R$ ${custoMensal.toFixed(2)}
            </h2>
            
            ${salario > 0 ? `
              <p class="text-emerald-400 text-sm font-bold mb-8">
                Consome ${impactoSalarial.toFixed(2)}% do seu salário
              </p>
            ` : '<div class="mb-8"></div>'}

            <div class="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 text-left">
                <div class="bg-white/5 p-4 rounded-2xl">
                    <p class="text-slate-500 text-[10px] uppercase font-black mb-1">Custo por Uso</p>
                    <p class="text-lg font-bold text-indigo-300 text-white">R$ ${custoPorUso.toFixed(2)}</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl">
                    <p class="text-slate-500 text-[10px] uppercase font-black mb-1">Duração</p>
                    <p class="text-lg font-bold text-white">${duracaoDias.toFixed(0)} dias</p>
                </div>
            </div>

            <div class="mt-6 p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30 flex items-center gap-3">
                <span class="text-xl">💡</span>
                <p class="text-[11px] text-slate-300 text-left leading-relaxed">
                    Cada vez que você usa este item, ele te custa <strong>R$ ${custoPorUso.toFixed(2)}</strong>. No ano, isso será <strong>R$ ${(custoMensal * 12).toFixed(2)}</strong>.
                </p>
            </div>
        </div>
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
    </div>
  `;
}
document.getElementById("calcular")?.addEventListener("click", calcular);
//# sourceMappingURL=index.js.map