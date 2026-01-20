type Unidade = "kg" | "g" | "ml" | "l" | "un";

interface Produto {
  nome: string;
  precoTotal: number;
  quantidadeTotal: number;
  unidade: Unidade;
}

const STORAGE_KEY = "custos-domesticos";

// Converte tudo para uma base comum para o cálculo não errar
function converterParaBase(qtd: number, unidade: Unidade): number {
  switch (unidade.toLowerCase()) {
    case "kg":
    case "l":
      return qtd * 1000; // Transforma quilo em grama, litro em ml
    default:
      return qtd;
  }
}

function calcular() {
  const nome = (document.getElementById("nome") as HTMLInputElement).value;
  const preco = Number((document.getElementById("preco") as HTMLInputElement).value);
  const qtdTotalInput = Number((document.getElementById("quantidadeTotal") as HTMLInputElement).value);
  const unidade = (document.getElementById("unidade") as HTMLSelectElement).value as Unidade;
  
  const qtdUso = Number((document.getElementById("quantidadePorUso") as HTMLInputElement).value);
  const usosDia = Number((document.getElementById("usos") as HTMLInputElement).value);

  // Lógica Matemática Pura:
  // 1. Achar o preço de 1g ou 1ml
  const baseTotal = converterParaBase(qtdTotalInput, unidade);
  const precoUnitario = preco / baseTotal;

  // 2. Multiplicar pelo que você usa
  const custoPorUso = precoUnitario * qtdUso;
  const custoDiario = custoPorUso * usosDia;
  const custoMensal = custoDiario * 30;

  // 3. Ver quanto tempo dura o pacote
  const duracaoDias = baseTotal / (qtdUso * usosDia);

  const display = document.getElementById("resultado")!;
  display.innerHTML = `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-indigo-600">${nome || 'Produto'}</h2>
      <hr class="border-slate-100">
      <div class="grid grid-cols-1 gap-3">
        <p class="text-slate-700">💰 Custo por Refeição/Uso: <strong>R$ ${custoPorUso.toFixed(2)}</strong></p>
        <p class="text-slate-700 font-bold text-lg">📅 Custo Diário: <span class="text-emerald-600">R$ ${custoDiario.toFixed(2)}</span></p>
        <p class="text-slate-700">🗓️ Custo Mensal: <strong>R$ ${custoMensal.toFixed(2)}</strong></p>
      </div>
      <div class="bg-blue-50 p-3 rounded-xl border border-blue-100 mt-4">
        <p class="text-blue-800 text-sm italic">O estoque de ${qtdTotalInput}${unidade} vai durar aprox. <strong>${duracaoDias.toFixed(0)} dias</strong>.</p>
      </div>
    </div>
  `;
}

document.getElementById("calcular")?.addEventListener("click", calcular);