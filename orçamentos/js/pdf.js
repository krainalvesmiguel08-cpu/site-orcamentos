/* Geração e download do PDF */
const PDF = {
  W: 210,
  M: 16,
  navy: [18, 48, 107],
  yel: [255, 122, 47],
  pale: [236, 242, 251],
  mut: [86, 102, 131]
};

function construirPDF() {
  const d = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
  const { W, M, navy, yel, pale, mut } = PDF;

  const E = {
    n: $("eNome").value || "Nome da empresa",
    nif: $("eNif").value,
    t: $("eTel").value,
    m: $("eMail").value,
    a: $("eMor").value
  };
  const numero = $("num").value;
  const data = fmtData($("data").value);
  let pagina = 1;

  function cabecalho() {
    d.setFillColor(...navy); d.rect(0, 0, W, 38, "F");
    d.setDrawColor(48, 83, 148); d.setLineWidth(.15);
    for (let i = 6; i < W; i += 6) d.line(i, 0, i, 38);
    for (let j = 6; j < 38; j += 6) d.line(0, j, W, j);
    d.setFillColor(255, 255, 255); d.rect(0, 38, W, 1, "F");
    d.setFillColor(...yel); d.rect(0, 39, W, 2, "F");

    let x = M;
    if (logo) {
      const s = Math.min(24 / logo.w, 24 / logo.h);
      const w = logo.w * s, h = logo.h * s;
      try { d.addImage(logo.src, logo.t, M, 7 + (24 - h) / 2, w, h); x = M + w + 6; } catch (e) {}
    }

    d.setTextColor(255, 255, 255); d.setFont("helvetica", "bold"); d.setFontSize(15);
    d.text(E.n, x, 15);
    d.setFont("helvetica", "normal"); d.setFontSize(8.5); d.setTextColor(200, 206, 214);
    const info = [E.a, [E.nif && "NIF " + E.nif, E.t].filter(Boolean).join("   "), E.m].filter(Boolean);
    info.forEach((s, i) => d.text(s, x, 21 + i * 4.5));

    d.setTextColor(...yel); d.setFont("helvetica", "bold"); d.setFontSize(22);
    d.text("ORÇAMENTO", W - M, 17, { align: "right" });
    d.setTextColor(255, 255, 255); d.setFontSize(9.5); d.setFont("helvetica", "normal");
    d.text("N.º " + numero, W - M, 24, { align: "right" });
    if (data) d.text(data, W - M, 29, { align: "right" });
  }

  function rodape() {
    d.setFillColor(...yel); d.rect(0, 285, W, 1.2, "F");
    d.setFillColor(...navy); d.rect(0, 286.2, W, 10.8, "F");
    d.setTextColor(200, 206, 214); d.setFontSize(8); d.setFont("helvetica", "normal");
    d.text(E.n + (E.t ? "  |  " + E.t : ""), M, 292, { baseline: "middle" });
    d.text("Página " + pagina, W - M, 292, { align: "right", baseline: "middle" });
  }

  function novaPagina() {
    d.addPage(); pagina++; cabecalho(); rodape();
    return 50;
  }

  cabecalho(); rodape();
  let y = 50;

  /* Cliente e local da obra */
  const caixa = (x, w, titulo, linhasTxt) => {
    const h = 8 + linhasTxt.length * 4.6 + 3;
    d.setFillColor(...pale); d.rect(x, y, w, h, "F");
    d.setFillColor(...yel); d.rect(x, y, 1.6, h, "F");
    d.setTextColor(...navy); d.setFont("helvetica", "bold"); d.setFontSize(9);
    d.text(titulo, x + 5, y + 6);
    d.setFont("helvetica", "normal"); d.setFontSize(9.5);
    linhasTxt.forEach((s, i) => d.text(s, x + 5, y + 11.5 + i * 4.6));
    return h;
  };
  const cliente = [
    $("cNome").value || "—",
    $("cNif").value && "NIF " + $("cNif").value,
    $("cTel").value,
    $("cMor").value
  ].filter(Boolean);
  const obra = d.splitTextToSize($("obra").value || "—", 72).slice(0, 4);
  const h1 = caixa(M, 88, "CLIENTE", cliente);
  const h2 = caixa(M + 94, W - 2 * M - 94, "LOCAL DA OBRA", obra);
  y += Math.max(h1, h2) + 8;

  /* Descrição */
  const desc = $("desc").value.trim();
  if (desc) {
    d.setTextColor(...navy); d.setFont("helvetica", "bold"); d.setFontSize(9);
    d.text("DESCRIÇÃO DO TRABALHO", M, y);
    d.setFont("helvetica", "normal"); d.setTextColor(60, 66, 74); d.setFontSize(9.5);
    const ls = d.splitTextToSize(desc, W - 2 * M);
    d.text(ls, M, y + 5);
    y += 5 + ls.length * 4.5 + 6;
  }

  /* Tabela */
  const cx = { q: W - M - 70, u: W - M - 58, p: W - M - 22, t: W - M };
  const cabTabela = () => {
    d.setFillColor(...navy); d.rect(M, y, W - 2 * M, 8, "F");
    d.setTextColor(255, 255, 255); d.setFont("helvetica", "bold"); d.setFontSize(8.5);
    d.text("TRABALHO / MATERIAL", M + 3, y + 5.3);
    d.text("QTD.", cx.q, y + 5.3, { align: "right" });
    d.text("UNID.", cx.u - 4, y + 5.3);
    d.text("PREÇO UNIT.", cx.p, y + 5.3, { align: "right" });
    d.text("TOTAL", cx.t - 3, y + 5.3, { align: "right" });
    y += 8;
  };
  cabTabela();

  linhas.filter(r => r.d || r.p).forEach((r, i) => {
    const ls = d.splitTextToSize(r.d || "—", cx.q - M - 22);
    const h = Math.max(8, ls.length * 4.4 + 4);
    if (y + h > 272) { y = novaPagina(); cabTabela(); }
    if (i % 2 === 0) { d.setFillColor(...pale); d.rect(M, y, W - 2 * M, h, "F"); }
    d.setTextColor(40, 46, 54); d.setFont("helvetica", "normal"); d.setFontSize(9.5);
    d.text(ls, M + 3, y + 5.4);
    d.text(String(r.q).replace(".", ","), cx.q, y + 5.4, { align: "right" });
    d.text(r.u, cx.u - 4, y + 5.4);
    d.text(fmt(r.p), cx.p, y + 5.4, { align: "right" });
    d.setFont("helvetica", "bold");
    d.text(fmt(r.q * r.p), cx.t - 3, y + 5.4, { align: "right" });
    y += h;
  });
  d.setDrawColor(...navy); d.setLineWidth(.4); d.line(M, y, W - M, y); y += 6;

  /* Totais */
  const T = totais();
  if (y > 235) y = novaPagina();
  const tx = W - M - 78;
  const linhaTotal = (a, b) => {
    d.setFont("helvetica", "normal"); d.setFontSize(9.5);
    d.setTextColor(...mut); d.text(a, tx, y);
    d.setTextColor(40, 46, 54); d.text(b, W - M - 3, y, { align: "right" });
    y += 6;
  };
  linhaTotal("Subtotal", fmt(T.sub));
  if (T.disc > 0) linhaTotal("Desconto", "− " + fmt(T.disc));
  linhaTotal("IVA (" + $("iva").value + "%)", fmt(T.iva));
  d.setFillColor(...navy); d.rect(tx - 4, y - 1, 82, 12, "F");
  d.setFillColor(...yel); d.rect(tx - 4, y - 1, 2, 12, "F");
  d.setTextColor(255, 255, 255); d.setFont("helvetica", "bold"); d.setFontSize(10);
  d.text("TOTAL", tx + 2, y + 6.6);
  d.setTextColor(...yel); d.setFontSize(14);
  d.text(fmt(T.total), W - M - 3, y + 7, { align: "right" });
  y += 20;

  /* Condições */
  const cond = [];
  if ($("pag").value) cond.push("Pagamento: " + $("pag").value);
  if ($("iban").value) cond.push("IBAN: " + $("iban").value);
  if ($("prazo").value) cond.push("Prazo de execução: " + $("prazo").value);
  cond.push("Validade deste orçamento: " + ($("val").value || 30) + " dias.");
  if ($("notas").value.trim()) cond.push($("notas").value.trim());

  const cs = cond.flatMap(s => d.splitTextToSize(s, W - 2 * M - 8));
  const ch = cs.length * 4.5 + 12;
  if (y + ch > 278) y = novaPagina();
  d.setFillColor(...pale); d.rect(M, y, W - 2 * M, ch, "F");
  d.setFillColor(...yel); d.rect(M, y, 1.6, ch, "F");
  d.setTextColor(...navy); d.setFont("helvetica", "bold"); d.setFontSize(9);
  d.text("CONDIÇÕES", M + 5, y + 6);
  d.setFont("helvetica", "normal"); d.setTextColor(60, 66, 74); d.setFontSize(9.5);
  d.text(cs, M + 5, y + 11.5);

  return d.output("blob");
}

function nomeFicheiroPDF() {
  const numero = ($("num").value || "").replace("/", "-");
  const cliente = $("cNome").value ? "-" + $("cNome").value.trim().replace(/\s+/g, "-") : "";
  return "Orcamento-" + numero + cliente + ".pdf";
}

function descarregarPDF() {
  mostrarMsg("");
  if (!window.jspdf) {
    mostrarMsg("A biblioteca de PDF não carregou. Verifica a ligação e tenta de novo.");
    return;
  }
  try {
    const blob = construirPDF();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nomeFicheiroPDF();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    guardarNoHistorico();
    mostrarMsg("PDF descarregado e orçamento registado no histórico.");
  } catch (e) {
    mostrarMsg("Não foi possível criar o PDF.");
  }
}
