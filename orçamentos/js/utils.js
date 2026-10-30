/* Funções utilitárias partilhadas */
const $ = id => document.getElementById(id);

const UNIDADES = ["un", "m", "m²", "m³", "h", "dia", "vg"];

// Campos da empresa (guardados no browser) e do orçamento (guardados no histórico)
const CAMPOS_EMPRESA = ["eNome", "eNif", "eTel", "eMail", "eMor", "iban"];
const CAMPOS_ORCAMENTO = [
  "cNome", "cNif", "cTel", "cMor", "obra", "desc",
  "num", "data", "val", "disc", "iva",
  "prazo", "iban", "pag", "notas"
];

const novaLinha = () => ({ d: "", q: 1, u: "un", p: 0 });

const num = v => parseFloat(String(v).replace(",", ".")) || 0;

const fmt = n =>
  n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";

const hoje = () => new Date().toISOString().slice(0, 10);

// "2026-10-30" -> "30/10/2026"
const fmtData = iso => (iso ? iso.split("-").reverse().join("/") : "");

const mostrarMsg = texto => { $("msg").textContent = texto; };
