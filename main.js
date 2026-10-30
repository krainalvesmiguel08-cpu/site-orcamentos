/* Ligação de eventos e arranque da aplicação */
function novoOrcamento() {
  ["cNome", "cNif", "cTel", "cMor", "obra", "desc", "notas", "prazo"].forEach(k => { $(k).value = ""; });
  $("disc").value = 0;
  linhas = [novaLinha()];
  $("data").value = hoje();
  $("num").value = proximoNumero();
  renderLinhas();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function carregarLogo(ev) {
  const f = ev.target.files[0];
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    const im = new Image();
    im.onload = () => {
      logo = { src: rd.result, w: im.width, h: im.height, t: f.type === "image/png" ? "PNG" : "JPEG" };
      guardarEmpresa();
    };
    im.src = rd.result;
  };
  rd.readAsDataURL(f);
}

function ligarEventos() {
  $("add").onclick = () => { linhas.push(novaLinha()); renderLinhas(); };
  ["disc", "iva"].forEach(k => $(k).addEventListener("input", calcular));
  CAMPOS_EMPRESA.forEach(k => $(k).addEventListener("input", guardarEmpresa));
  $("eLogo").addEventListener("change", carregarLogo);
  $("pdf").onclick = descarregarPDF;
  $("novo").onclick = novoOrcamento;
  $("gua").onclick = () => {
    guardarNoHistorico();
    mostrarMsg("Orçamento " + $("num").value + " guardado no histórico.");
  };
}

function iniciar() {
  carregarEmpresa();
  $("data").value = hoje();
  $("num").value = proximoNumero();
  ligarEventos();
  renderLinhas();
  renderHistorico();
}

iniciar();
