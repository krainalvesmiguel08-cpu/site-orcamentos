/* Tudo o que lê e escreve no localStorage */
let logo = null;

function lerLS(chave, padrao) {
  try {
    const v = localStorage.getItem(chave);
    return v ? JSON.parse(v) : padrao;
  } catch (e) {
    return padrao;
  }
}

function escreverLS(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) {}
}

/* Dados da empresa */
function carregarEmpresa() {
  const s = lerLS("empresa", {});
  CAMPOS_EMPRESA.forEach(k => { if (s[k]) $(k).value = s[k]; });
  if (s.logo) logo = s.logo;
}

function guardarEmpresa() {
  const o = { logo };
  CAMPOS_EMPRESA.forEach(k => { o[k] = $(k).value; });
  escreverLS("empresa", o);
}

/* Histórico de orçamentos */
const lerHistorico = () => lerLS("hist", []);
const escreverHistorico = h => escreverLS("hist", h.slice(0, 50));

function proximoNumero() {
  const ano = new Date().getFullYear();
  let n = 0;
  lerHistorico().forEach(x => {
    const p = String(x.num).split("/");
    if (p[0] == ano) n = Math.max(n, parseInt(p[1]) || 0);
  });
  return ano + "/" + String(n + 1).padStart(3, "0");
}
