/* Histórico de orçamentos guardados */
function guardarNoHistorico() {
  const s = {
    rows: JSON.parse(JSON.stringify(linhas)),
    total: totais().total
  };
  CAMPOS_ORCAMENTO.forEach(k => { s[k] = $(k).value; });

  const h = lerHistorico().filter(x => x.num !== s.num);
  h.unshift(s);
  escreverHistorico(h);
  renderHistorico();
}

function abrirOrcamento(s) {
  CAMPOS_ORCAMENTO.forEach(k => { $(k).value = s[k] ?? $(k).value; });
  linhas = s.rows && s.rows.length ? s.rows : [novaLinha()];
  renderLinhas();
  window.scrollTo({ top: 0, behavior: "smooth" });
  mostrarMsg("Orçamento " + s.num + " aberto.");
}

function apagarOrcamento(s, botao) {
  if (botao.dataset.ok) {
    escreverHistorico(lerHistorico().filter(z => z.num !== s.num));
    renderHistorico();
  } else {
    botao.dataset.ok = 1;
    botao.textContent = "Confirmar";
  }
}

function criarItemHistorico(s) {
  const el = document.createElement("div");
  el.className = "hi";

  const info = document.createElement("div");
  const titulo = document.createElement("b");
  const detalhe = document.createElement("span");
  titulo.textContent = s.num + " – " + (s.cNome || "Sem cliente");
  detalhe.textContent = (s.data ? fmtData(s.data) + " – " : "") + fmt(s.total || 0);
  info.append(titulo, detalhe);

  const acoes = document.createElement("div");
  const abrir = document.createElement("button");
  const apagar = document.createElement("button");
  abrir.type = apagar.type = "button";
  abrir.textContent = "Abrir";
  apagar.textContent = "Apagar";
  apagar.className = "x btn-text";
  abrir.onclick = () => abrirOrcamento(s);
  apagar.onclick = () => apagarOrcamento(s, apagar);
  acoes.append(abrir, apagar);

  el.append(info, acoes);
  return el;
}

function renderHistorico() {
  const h = lerHistorico();
  const box = $("lista");
  box.innerHTML = h.length ? "" : "<p class='msg'>Ainda não há orçamentos guardados.</p>";
  h.forEach(s => box.appendChild(criarItemHistorico(s)));
}
