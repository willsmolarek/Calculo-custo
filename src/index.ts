type Unidade = "kg" | "ml" | "un";

interface Produto {
  nome: string;
  precoTotal: number;
  quantidadeTotal: number;
  unidade: Unidade;
}

interface Consumo {
  quantidadePorUso: number;
  usosPorDia: number;
  unidadeUso: "base" | "kilo";
}

const STORAGE_KEY = "smart-cost-data";

// =======================
// CONVERSÃO E CÁLCULOS
// =======================

function obterQtdBase(qtd: number, unidade: Unidade): number {
  if (unidade === "kg" || unidade === "ml") return qtd * 1000;
  return qtd;
}

function obterQtdUsoBase(qtd: number, tipo: "base" | "kilo"): number {
  if (tipo === "kilo") return qtd * 1000;
  return qtd;
}

function calcularMetricas(p: Produto, c: Consumo) {
  const totalBase = obterQtdBase(p.quantidadeTotal, p.unidade);
  const usoBase = obterQtdUsoBase(c.quantidadePorUso, c.unidadeUso);
  
  const custoUnitario = p.precoTotal / totalBase;
  const custoUso = custoUnitario * usoBase;
  const mensal = custoUso * c.usosPorDia * 30;
  
  const duracaoDias = c.usosPorDia > 0 ? totalBase / (usoBase * c.usosPorDia) : 0;
  const totalDoses = usoBase > 0 ? totalBase / usoBase : 0;

  return { custoUso, mensal, duracaoDias, totalDoses };
}

// =======================
// INTERFACE E DOM
// =======================

function lerProduto(): Produto {
  return {
    nome: (document.getElementById("nome") as HTMLInputElement).value || "Item sem nome",
    precoTotal: Number((document.getElementById("preco") as HTMLInputElement).value) || 0,
    quantidadeTotal: Number((document.getElementById("quantidadeTotal") as HTMLInputElement).value) || 1,
    unidade: (document.getElementById("unidade") as HTMLSelectElement).value as Unidade,
  };
}

function lerConsumo(): Consumo {
  const usos = Number((document.getElementById("usos") as HTMLInputElement).value) || 0;
  const tipo = (document.getElementById("tipoConsumo") as HTMLSelectElement).value;

  return {
    quantidadePorUso: Number((document.getElementById("quantidadePorUso") as HTMLInputElement).value) || 0,
    unidadeUso: (document.getElementById("unidadeUso") as HTMLSelectElement).value as "base" | "kilo",
    usosPorDia: tipo === "mes" ? usos / 30 : usos
  };
}

function mostrarResultado() {
  const p = lerProduto();
  const c = lerConsumo();
  const precoVendaInput = document.getElementById("precoVenda") as HTMLInputElement;
  const precoVenda = Number(precoVendaInput?.value) || 0;
  
  const res = calcularMetricas(p, c);
  const lucroUnitario = precoVenda - res.custoUso;
  const margemPercentual = precoVenda > 0 ? (lucroUnitario / precoVenda) * 100 : 0;
  
  // Sugestão de preço (Markup de 3x)
  const sugestao = res.custoUso * 3;

  const display = document.getElementById("resultado")!;

  display.innerHTML = `
    <div class="relative z-10 w-full">
      <div class="flex justify-between items-center mb-6">
        <span class="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30">Análise Smart</span>
        <span class="text-slate-400 text-xs font-bold">${p.nome}</span>
      </div>
      
      <div class="space-y-6">
        <div>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Custo por Dose</p>
          <h2 class="text-4xl font-black text-rose-400 leading-none">R$ ${res.custoUso.toFixed(2)}</h2>
        </div>

        ${precoVenda > 0 ? `
          <div class="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[24px]">
            <p class="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">Lucro por Venda</p>
            <div class="flex items-baseline gap-2">
              <h2 class="text-3xl font-black text-emerald-400">R$ ${lucroUnitario.toFixed(2)}</h2>
              <span class="text-emerald-500 font-bold text-sm">(${margemPercentual.toFixed(0)}%)</span>
            </div>
          </div>
        ` : `
          <div class="p-5 bg-amber-500/10 border border-amber-500/20 rounded-[24px]">
            <p class="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-1">💡 Sugestão de Venda</p>
            <p class="text-white font-bold text-lg">R$ ${sugestao.toFixed(2)}</p>
            <p class="text-slate-400 text-[10px]">Para margem de 66% (3x o custo)</p>
          </div>
        `}

        <div class="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
          <div>
            <p class="text-slate-500 text-[10px] uppercase font-black mb-1">Duração</p>
            <p class="text-xl font-bold text-white">${res.duracaoDias.toFixed(0)} dias</p>
          </div>
          <div>
            <p class="text-slate-500 text-[10px] uppercase font-black mb-1">Rendimento</p>
            <p class="text-xl font-bold text-indigo-400">${res.totalDoses.toFixed(0)} doses</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTabela() {
  const container = document.getElementById("listaSimples") || document.querySelector("#tabela tbody");
  if (!container) return;

  const lista = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  container.innerHTML = "";
  
  lista.reverse().forEach((item: any) => {
    const { custoUso } = calcularMetricas(item.produto, item.consumo);
    container.innerHTML += `
      <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
        <div>
          <p class="font-bold text-slate-800 text-sm">${item.produto.nome}</p>
          <p class="text-[10px] text-slate-400 font-bold uppercase">Custo Dose: R$ ${custoUso.toFixed(2)}</p>
        </div>
        <button onclick="window.removerItem('${item.produto.nome}')" class="text-slate-300 hover:text-rose-500">
           ✕
        </button>
      </div>
    `;
  });
}

// Global para deletar
(window as any).removerItem = (nome: string) => {
  let lista = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  lista = lista.filter((i: any) => i.produto.nome !== nome);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  renderTabela();
};

// =======================
// EVENTOS
// =======================

document.getElementById("calcular")?.addEventListener("click", mostrarResultado);

document.getElementById("salvar")?.addEventListener("click", () => {
  const lista = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  lista.push({ produto: lerProduto(), consumo: lerConsumo() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  renderTabela();
});

// Inicialização
renderTabela();