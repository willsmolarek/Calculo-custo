type Unidade = "kg" | "g" | "ml" | "l" | "un";

// =======================
// LÓGICA DE CONVERSÃO
// =======================

// Esta função resolve o erro 2304
function converterParaBase(qtd: number, unidade: Unidade): number {
  switch (unidade.toLowerCase()) {
    case "kg":
    case "l":
      return qtd * 1000; // Converte quilo/litro para grama/ml
    default:
      return qtd;
  }
}

// =======================
// FUNÇÃO PRINCIPAL
// =======================

function calcular(): void {
  // Captura dos elementos do DOM
  const nomeInput = document.getElementById("nome") as HTMLInputElement;
  const precoInput = document.getElementById("preco") as HTMLInputElement;
  const qtdTotalInput = document.getElementById("quantidadeTotal") as HTMLInputElement;
  const unidadeSelect = document.getElementById("unidade") as HTMLSelectElement;
  const qtdUsoInput = document.getElementById("quantidadePorUso") as HTMLInputElement;
  const usosInput = document.getElementById("usos") as HTMLInputElement;
  const resDiv = document.getElementById("resultado");

  if (!resDiv) return;

  // Valores numéricos
  const nome = nomeInput.value || "Produto";
  const preco = Number(precoInput.value) || 0;
  const qtdTotal = Number(qtdTotalInput.value) || 1;
  const unidade = unidadeSelect.value as Unidade;
  const qtdUso = Number(qtdUsoInput.value) || 0;
  const usosDia = Number(usosInput.value) || 0;

  // Cálculos
  const baseTotal = converterParaBase(qtdTotal, unidade);
  const precoUnitario = preco / baseTotal;

  const custoPorUso = precoUnitario * qtdUso;
  const custoDiario = custoPorUso * usosDia;
  const custoMensal = custoDiario * 30;
  const duracaoDias = usosDia > 0 && qtdUso > 0 ? baseTotal / (qtdUso * usosDia) : 0;

  // Renderização do Resultado "Premium"
  resDiv.classList.remove("hidden");
  resDiv.innerHTML = `
    <div class="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
        <div class="relative z-10">
            <div class="flex justify-between items-center mb-6">
                <span class="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30 text-white">Relatório de Gasto</span>
                <span class="text-slate-500 text-xs font-bold uppercase tracking-widest">${nome}</span>
            </div>
            
            <div class="mb-8">
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Impacto Diário no Bolso</p>
                <h2 class="text-5xl font-black text-white leading-none tracking-tight">
                    R$ ${custoDiario.toFixed(2)}
                </h2>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div>
                    <p class="text-slate-500 text-[10px] uppercase font-black mb-1">Total no Mês</p>
                    <p class="text-xl font-bold text-white">R$ ${custoMensal.toFixed(2)}</p>
                </div>
                <div>
                    <p class="text-slate-500 text-[10px] uppercase font-black mb-1">Duração do Item</p>
                    <p class="text-xl font-bold text-indigo-400">${duracaoDias.toFixed(0)} dias</p>
                </div>
            </div>

            <div class="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div class="text-2xl">💡</div>
                <p class="text-[11px] text-slate-300 leading-relaxed">
                    Cada <strong>uso individual</strong> custa aproximadamente <strong>R$ ${custoPorUso.toFixed(2)}</strong>.
                </p>
            </div>
        </div>
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
    </div>
  `;
}

// =======================
// INICIALIZAÇÃO
// =======================

document.getElementById("calcular")?.addEventListener("click", calcular);