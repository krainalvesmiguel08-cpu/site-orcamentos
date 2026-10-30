/* Linhas do orçamento, totais e cálculos */
let linhas = [novaLinha()];

function totais() {
  const sub = linhas.reduce((a, r) => a + r.q * r.p, 0);
  const desc = Math.min(num($("disc").value), sub);
  const base = sub - desc;
  const iva = base * num($("iva").value) / 100;
  return { sub, disc: desc, iva, total: base + iva };
}

function calcular() {
  document.querySelectorAll(".row").forEach((el, i) => {
    el.querySelector(".t").textContent = fmt(linhas[i].q * linhas[i].p);
  });
  const t = totais();
  $("sub").textContent = fmt(t.sub);
  $("dsc").textContent = "− " + fmt(t.disc);
  $("ivv").textContent = fmt(t.iva);
  $("tt").textContent = fmt(t.total);
}

function criarLinha(r, i) {
  const el = document.createElement("div");
  el.className = "row";
  el.innerHTML = `
    <label class="d">Trabalho<input data-k="d"></label>
    <label>Qtd.<input data-k="q" type="number" min="0" step="any"></label>
    <label>Unid.<select data-k="u">${UNIDADES.map(u => `<option>${u}</option>`).join("")}</select></label>
    <label>Preço unit.<input data-k="p" type="number" min="0" step="0.01"></label>
    <div class="t"></div>
    <button class="x rm" type="button" aria-label="Remover linha">✕</button>`;

  el.querySelector("[data-k=d]").value = r.d;
  el.querySelector("[data-k=q]").value = r.q;
  el.querySelector("[data-k=u]").value = r.u;
  el.querySelector("[data-k=p]").value = r.p || "";

  el.querySelectorAll("[data-k]").forEach(inp => {
    inp.addEventListener("input", () => {
      const k = inp.dataset.k;
      r[k] = (k === "q" || k === "p") ? num(inp.value) : inp.value;
      calcular();
    });
  });

  el.querySelector(".rm").onclick = () => {
    linhas.splice(i, 1);
    if (!linhas.length) linhas.push(novaLinha());
    renderLinhas();
  };
  return el;
}

function renderLinhas() {
  const box = $("rows");
  box.innerHTML = "";
  linhas.forEach((r, i) => box.appendChild(criarLinha(r, i)));
  calcular();
}
