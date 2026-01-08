type Unidade = "g" | "kg" | "ml" | "mg" | "un";

interface Produto {
  nome: string;
  precoTotal: number;
  quantidadeTotal: number;
  unidade: Unidade;
}

interface Consumo {
  quantidadePorUso: number;
  usosPorDia: number;
}

interface DadosSalvos {
  produto: Produto;
  consumo: Consumo;
}

const STORAGE_KEY = "controle-custos";

// =======================
// CONVERSÃO
// =======================

function converterParaBase(qtd: number, unidade: Unidade): number {
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

function custoPorUnidade(produto: Produto): number {
  const base = converterParaBase(produto.quantidadeTotal, produto.unidade);
  return produto.precoTotal / base;
}

function custoPorUso(produto: Produto, consumo: Consumo): number {
  return custoPorUnidade(produto) * consumo.quantidadePorUso;
}

function custoDiario(produto: Produto, consumo: Consumo): number {
  return custoPorUso(produto, consumo) * consumo.usosPorDia;
}

function custoMensal(produto: Produto, consumo: Consumo): number {
  return custoDiario(produto, consumo) * 30;
}

// =======================
// MÉTRICAS
// =======================

function usosTotais(produto: Produto, consumo: Consumo): number {
  const base = converterParaBase(produto.quantidadeTotal, produto.unidade);
  return base / consumo.quantidadePorUso;
}

function diasDeDuracao(produto: Produto, consumo: Consumo): number {
  return usosTotais(produto, consumo) / consumo.usosPorDia;
}

function usosPorMes(consumo: Consumo): number {
  return consumo.usosPorDia * 30;
}

function produtosPorMes(produto: Produto, consumo: Consumo): number {
  return 30 / diasDeDuracao(produto, consumo);
}

// =======================
// STORAGE
// =======================

function carregarLista(): DadosSalvos[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function salvarNaLista(dados: DadosSalvos): void {
  const lista = carregarLista();
  lista.push(dados);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// =======================
// DOM
// =======================

const resultado = document.getElementById("resultado") as HTMLElement;

function lerProduto(): Produto {
  return {
    nome: (document.getElementById("nome") as HTMLInputElement).value,
    precoTotal: Number((document.getElementById("preco") as HTMLInputElement).value),
    quantidadeTotal: Number((document.getElementById("quantidadeTotal") as HTMLInputElement).value),
    unidade: (document.getElementById("unidade") as HTMLSelectElement).value as Unidade,
  };
}

function lerConsumo(): Consumo {
  const quantidadePorUso = Number(
    (document.getElementById("quantidadePorUso") as HTMLInputElement).value
  );

  const tipoConsumo = (document.getElementById("tipoConsumo") as HTMLSelectElement).value;

  const usos = Number(
    (document.getElementById("usos") as HTMLInputElement).value
  );

  const usosPorDia = tipoConsumo === "mes"
    ? usos / 30
    : usos;

  return {
    quantidadePorUso,
    usosPorDia,
  };
}

function mostrarResultado(produto: Produto, consumo: Consumo): void {
  const diario = custoDiario(produto, consumo);
  const mensal = custoMensal(produto, consumo);

  const unidadeLabel =
    produto.unidade === "un"
      ? "unidade(s)"
      : produto.unidade;

  resultado.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px;">
      
      <div>
        <strong style="font-size:18px;">${produto.nome}</strong>
        <span style="color:#555; font-size:13px;">
          (${unidadeLabel})
        </span>
      </div>

      <hr/>

      <div>
        <strong>💰 Custos</strong><br/>
        • Custo por uso: <strong>R$ ${custoPorUso(produto, consumo).toFixed(2)}</strong><br/>
        • Custo diário: <strong>R$ ${diario.toFixed(2)}</strong><br/>
        • Custo mensal: <strong>R$ ${mensal.toFixed(2)}</strong>
      </div>

      <div>
        <strong>📦 Consumo</strong><br/>
        • Usos totais do produto: <strong>${usosTotais(produto, consumo).toFixed(0)}</strong><br/>
        • Duração estimada: <strong>${diasDeDuracao(produto, consumo).toFixed(1)} dias</strong><br/>
        • Usos por mês (estimado): <strong>${usosPorMes(consumo).toFixed(0)}</strong><br/>
        • Produtos consumidos por mês: <strong>${produtosPorMes(produto, consumo).toFixed(2)}</strong>
      </div>

    </div>
  `;
}


function renderTabela(): void {
  const tbody = document.querySelector("#tabela tbody") as HTMLElement;
  const lista = carregarLista();

  tbody.innerHTML = "";

  lista.forEach(({ produto, consumo }) => {
    tbody.innerHTML += `
      <tr>
        <td>${produto.nome}</td>
        <td>R$ ${custoDiario(produto, consumo).toFixed(2)}</td>
        <td>R$ ${custoMensal(produto, consumo).toFixed(2)}</td>
      </tr>
    `;
  });
}

// =======================
// EVENTOS
// =======================

(document.getElementById("calcular") as HTMLButtonElement)
  .addEventListener("click", () => {
    mostrarResultado(lerProduto(), lerConsumo());
  });

(document.getElementById("salvar") as HTMLButtonElement)
  .addEventListener("click", () => {
    salvarNaLista({ produto: lerProduto(), consumo: lerConsumo() });
    renderTabela();
  });

// =======================
// INIT
// =======================

renderTabela();
