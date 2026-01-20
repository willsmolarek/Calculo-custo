type Unidade = "kg" | "ml" | "un";

interface Produto {
  nome: string;
  precoTotal: number;
  quantidadeTotal: number; // Ex: 20
  unidade: Unidade;       // Ex: "ml" (que trataremos como L se for input de business)
}

interface Consumo {
  quantidadePorUso: number; // Ex: 300
  usosPorDia: number;
  unidadeUso: "base" | "kilo"; // base = g/ml, kilo = kg/L
}

const STORAGE_KEY = "smart-cost-data";

// =======================
// LÓGICA DE CONVERSÃO UNITÁRIA
// =======================

function obterQtdBase(qtd: number, unidade: Unidade): number {
  // Padroniza tudo para a menor unidade (g, ml, un)
  if (unidade === "kg" || unidade === "ml") return qtd * 1000;
  return qtd;
}

function obterQtdUsoBase(qtd: number, tipo: "base" | "kilo"): number {
  if (tipo === "kilo") return qtd * 1000;
  return qtd;
}

// =======================
// CÁLCULOS
// =======================

function calcularMetricas(p: Produto, c: Consumo) {
  const totalBase = obterQtdBase(p.quantidadeTotal, p.unidade);
  const usoBase = obterQtdUsoBase(c.quantidadePorUso, c.unidadeUso);
  
  const custoUnitario = p.precoTotal / totalBase;
  const custoUso = custoUnitario * usoBase;
  const mensal = custoUso * c.usosPorDia * 30;
  
  const duracaoDias = totalBase / (usoBase * c.usosPorDia);
  const totalDoses = totalBase / usoBase;

  return { custoUso, mensal, duracaoDias, totalDoses };
}

// =======================
// INTERFACE E DOM
// =======================

function mostrarResultado() {
  const p = lerProduto();
  const c = lerConsumo();
  const precoVenda = Number((document.getElementById("precoVenda") as HTMLInputElement).value) || 0;
  
  const res = calcularMetricas(p, c);
  const lucroUnitario = precoVenda - res.custoUso;
  const margemPercentual = precoVenda > 0 ? (lucroUnitario / precoVenda) * 100 : 0;
  
  const display = document.getElementById("resultado")!;

  display.innerHTML = `
    <div class="relative z-10">
      <div class="flex justify-between items-start mb-4">
        <span class="bg-indigo-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">Análise de Negócio</span>
        <span class="text-slate-400 text-xs">${p.nome || 'Item'}</span>
      </div>
      
      <div class="grid grid-cols-1 gap-6 mb-8">
        <div>
          <p class="text-slate-400 text-sm mb-1">Custo por Dose</p>
          <h2 class="text-3xl font-black text-white leading-none text-rose-400">R$ ${res.custoUso.toFixed(2)}</h2>
        </div>

        ${precoVenda > 0 ? `
        <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <p class="text-emerald-400 text-xs font-bold uppercase mb-1">Lucro por Venda</p>
          <div class="flex items-baseline gap-2">
            <h2 class="text-3xl font-black text-emerald-400">R$ ${lucroUnitario.toFixed(2)}</h2>
            <span class="text-emerald-500 font-bold text-sm">(${margemPercentual.toFixed(1)}%)</span>
          </div>
        </div>
        ` : `<p class="text-slate-500 text-xs italic">Insira o preço de venda para calcular o lucro.</p>`}
      </div>

      <div class="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
        <div>
          <p class="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Faturamento Mensal Est.</p>
          <p class="text-xl font-bold text-white">R$ ${(precoVenda * c.usosPorDia * 30).toFixed(2)}</p>
        </div>
        <div>
          <p class="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Rendimento Total</p>
          <p class="text-xl font-bold text-indigo-400">${res.totalDoses.toFixed(0)} <span class="text-xs italic text-slate-500 font-normal">copos/doses</span></p>
        </div>
      </div>

      <div class="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
        <div class="text-2xl">💡</div>
        <p class="text-xs text-slate-300 leading-relaxed">
          Para cada barril/pacote, terás um lucro bruto de <strong>R$ ${(lucroUnitario * res.totalDoses).toFixed(2)}</strong>.
        </p>
      </div>
    </div>
    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl"></div>
  `;
}

function lerProduto(): Produto {
  return {
    nome: (document.getElementById("nome") as HTMLInputElement).value,
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

function renderTabela() {
  const tbody = document.querySelector("#tabela tbody")!;
  const lista = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  tbody.innerHTML = "";
  
  lista.forEach((item: any) => {
    const { mensal } = calcularMetricas(item.produto, item.consumo);
    tbody.innerHTML += `
      <tr class="group hover:bg-slate-50 transition-colors">
        <td class="py-3 font-medium text-slate-700">${item.produto.nome}</td>
        <td class="py-3 text-right font-bold text-slate-900">R$ ${mensal.toFixed(2)}</td>
      </tr>
    `;
  });
}

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

renderTabela();