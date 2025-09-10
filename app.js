// ===== utilidades =====
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

// ===== helpers de data (3 campos: DD, MM, AAAA) =====
function readDateParts(prefix){
  const d = parseInt(($("#"+prefix+"Dia")?.value||"").trim(), 10);
  const m = parseInt(($("#"+prefix+"Mes")?.value||"").trim(), 10);
  const y = parseInt(($("#"+prefix+"Ano")?.value||"").trim(), 10);
  if (!Number.isInteger(d) || !Number.isInteger(m) || !Number.isInteger(y)) return "";
  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return "";
  // validação simples para meses/dias (inclui fevereiro bissexto)
  const dt = new Date(y, m-1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== (m-1) || dt.getDate() !== d) return "";
  // retorna formato ISO yyyy-mm-dd
  return `${String(y).padStart(4,'0')}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function setDateParts(prefix, yyyy_mm_dd){
  if (!yyyy_mm_dd) return;
  const [y,m,d] = yyyy_mm_dd.split("-").map(v => parseInt(v,10));
  if (!y || !m || !d) return;
  $("#"+prefix+"Dia") && ($("#"+prefix+"Dia").value = String(d).padStart(2,'0'));
  $("#"+prefix+"Mes") && ($("#"+prefix+"Mes").value = String(m).padStart(2,'0'));
  $("#"+prefix+"Ano") && ($("#"+prefix+"Ano").value = String(y));
}

// ===== preencher exemplo =====
$("#btnPreencherExemplo")?.addEventListener("click", () => {
  $("#nome").value = "MARIA DAS DORES SILVA";
  $("#nacionalidade").value = "brasileira";
  $("#estadoCivil").value = "solteiro(a)";
  $("#profissao").value = "autônoma";
  setDateParts("dataNascimento", "1992-08-15");
  $("#doc").value = "123.456.789-00";
  setDateParts("dataExpedicao", "2010-05-12");
  $("#orgao").value = "SSP/AM";
  $("#filho1").value = "JOÃO CARLOS SILVA";
  $("#filho2").value = "MARIA APARECIDA SILVA";
  $("#endereco").value = "Rua Exemplo, 123 - Centro, Coari/AM";
  $("#telefone").value = "(92) 99999-0000";
  setDateParts("dataDeclaracao", new Date().toISOString().slice(0,10));

  // Finalidades
  $$(".opt").forEach(c => c.checked = false);
  $$(".opt").find(c => c.value === "certNasc").checked = true;
  $$(".opt").find(c => c.value === "certNegativaSimples").checked = true;
  $("#certNegativaDe").value = "Protestos";

  render();
});

// ===== botão Hoje para Data da Declaração =====
$("#btnHojeDecl")?.addEventListener("click", () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  setDateParts("dataDeclaracao", `${yyyy}-${mm}-${dd}`);
  render();
});

// ===== renderização =====
function render(){
  const nome = $("#nome").value.trim();
  const nacionalidade = $("#nacionalidade").value.trim() || "brasileiro (a)";
  const estadoCivil = $("#estadoCivil").value.trim();
  const profissao = $("#profissao").value.trim();
  const nasc = formatDate(readDateParts("dataNascimento"));
  const doc = $("#doc").value.trim();
  const dataExp = formatDate(readDateParts("dataExpedicao"));
  const orgao = $("#orgao").value.trim();
  const filho1 = $("#filho1").value.trim();
  const filho2 = $("#filho2").value.trim();
  const endereco = $("#endereco").value.trim();
  const telefone = $("#telefone").value.trim();
  const dataDecl = formatDate(readDateParts("dataDeclaracao"));

  const mark = v => v ? "(  X  )" : "(     )";
  const get = key => $$(".opt").find(c => c.value === key)?.checked || false;

  const certNasc = mark(get("certNasc"));
  const certCas = mark(get("certCas"));
  const certNascTeor = mark(get("certNascTeor"));
  const certNegativaSimples = mark(get("certNegativaSimples"));
  const certNegativaDe = $("#certNegativaDe").value.trim();

  const certNascimento = mark(get("certNascimento"));
  const certInteiroTeor = mark(get("certInteiroTeor"));
  const certNegativa = mark(get("certNegativa"));

  const filhoMarc = mark(get("filho"));
  const nomeFilho = $("#nomeFilho").value.trim();
  const idadeFilho = $("#idadeFilho").value.trim();

  const netoMarc = mark(get("neto"));
  const nomeNeto = $("#nomeNeto").value.trim();
  const idadeNeto = $("#idadeNeto").value.trim();

  const retifMarc = mark(get("retificacao"));
  const retificacao = $("#retificacao").value.trim();

  const destino = $("#renderDestino");
  destino.innerHTML = `
    <div class="doc-body">
    <h1 class="title">DECLARAÇÃO DE INSUFICIÊNCIA ECONÔMICA</h1>

    <p class="para-group">
      Eu, ${lineOrText(nome,480)}, ${escapeHTML(nacionalidade)}, estado civil: ${lineOrText(estadoCivil,160)}, 
      Profissão: ${lineOrText(profissao,200)}, nascido(a) no dia: ${lineOrText(nasc,160)}, portador (a) do RG ou CPF nº 
      ${lineOrText(doc,220)}, expedida em ${lineOrText(dataExp,160)} por ${lineOrText(orgao,200)}, filho(a) de 
      ${lineOrText(filho1,420)} e de ${lineOrText(filho2,420)}, residente e domiciliado (a) 
      ${lineOrText(endereco,640)} telefone: ${lineOrText(telefone,200)}.
    </p>

    <p class="tight">Abaixo assinado, declaro sob penas de Lei, que não possuo recursos econômicos para arcar com o valor de emolumentos, sem prejuízo do meu sustento e de minha família,</p>
    <p class="tight">para obter:</p>

    <p class="tight">${certNasc} Minha Certidão de Nascimento  /   ${certCas} Casamento</p>
    <p class="tight">${certNascTeor} Minha Certidão de Nascimento de Teor.</p>
    <p class="tight">${certNegativaSimples} Certidão Negativa de ${lineOrText(certNegativaDe,260)}</p>
    <p class="tight">${certNascimento} Certidão de Nascimento   ${certInteiroTeor} Certidão de Inteiro Teor   ${certNegativa} Certidão Negativa:</p>
    <p class="tight">${filhoMarc} do meu filho (a): ${lineOrText(nomeFilho,260)} idade: ${lineOrText(idadeFilho,80)}</p>
    <p class="tight">${netoMarc} do meu neto(a): ${lineOrText(nomeNeto,260)} idade: ${lineOrText(idadeNeto,80)}</p>
    <p class="tight">${retifMarc} Retificação Extrajudicial: ${lineOrText(retificacao,320)}</p>
    <p class="txt22">Responsabilizando-me pela verdade acima prestadas, ciente das sanções civis administrativas e criminais que possa a vir a sofrer, caso seja posteriormente comprovada a falsidade da presente declaração. (Lei 7.115/83).</p>
    <p class="city-date">Coari - Amazonas, ${lineOrText(dataDecl,160)}</p>
    </div>

    <div class="assinatura">
      <div class="linha"></div>
      <div>Requerente</div>
    </div>

    <div class="duas-linhas">
      <div class="linha"></div>
      <div class="linha"></div>
    </div>
  `;
}

function escapeHTML(s){
  return (s||"").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]));
}

// ===== informações em negrito nas variáveis =====
function lineOrText(text, minWidth){
  const t = (text||"").trim();
  if(!t){
    return `<span class="line" style="min-width:${minWidth}px"></span>`;
  }
  return `<strong>${escapeHTML(t)}</strong>`;
}

function formatDate(v){
  if(!v) return "";
  // Trate "YYYY-MM-DD" como data LOCAL (evita voltar 1 dia em fuso -03:00)
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)){
    const [y,m,d] = v.split("-").map(Number);
    const dd = String(d).padStart(2,'0');
    const mm = String(m).padStart(2,'0');
    const yyyy = y;
    return `${dd}/${mm}/${yyyy}`;
  }
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}


// Atualiza a visualização quando algo muda
$$(".form-panel input, .form-panel .opt, .form-panel select").forEach(el => {
  el.addEventListener("input", render);
  el.addEventListener("change", render);
});
render();

// ===== Validação antes de gerar PDF =====
function checarFinalidadeObrigatoria(){
  return $$(".opt").some(c => c.checked);
}

function validarDataGrupo(prefix){
  const iso = readDateParts(prefix);
  const ok = !!iso;
  // aplica estado de validação visual nos 3 campos
  const g = document.querySelector(`.date-3[data-group='${prefix}']`);
  if (g){
    g.querySelectorAll("input").forEach(inp => {
      inp.setCustomValidity(ok ? "" : "Data inválida");
    });
  }
  return ok;
}

function camposObrigatoriosValidos(){
  const form = $("#formDeclaracao");
  if (!form) return true;
  // valida data de nascimento, expedição e declaração
  const okN = validarDataGrupo("dataNascimento");
  const okE = validarDataGrupo("dataExpedicao");
  const okD = validarDataGrupo("dataDeclaracao");
  const valid = form.checkValidity() && okN && okE && okD;
  form.classList.add("was-validated");
  return valid;
}

function mostrarToast(msg){
  const el = $("#toastAviso");
  $("#toastMsg").textContent = msg;
  if (window.bootstrap?.Toast){
    const t = bootstrap.Toast.getOrCreateInstance(el);
    t.show();
  }else{
    alert(msg);
  }
}

$("#btnGerarPDF")?.addEventListener("click", async () => {
  if (!camposObrigatoriosValidos()){
    mostrarToast("Preencha os campos obrigatórios destacados.");
    return;
  }
  if (!checarFinalidadeObrigatoria()){
    mostrarToast("Selecione ao menos uma finalidade.");
    $("#optCertNasc")?.focus();
    return;
  }

  render();

  const btn = $("#btnGerarPDF");
  btn.disabled = true;
  btn.querySelector(".btn-label").classList.add("d-none");
  btn.querySelector(".btn-spinner").classList.remove("d-none");

  try{
    const sheet = $("#sheetA4 .sheet-inner");
    const canvas = await html2canvas(sheet, {scale:2, useCORS:true, background:"#ffffff"});
    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Ajusta proporcionalmente para CABER na página (largura e altura)
const scaleToFit = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
const imgWidth = canvas.width * scaleToFit;
const imgHeight = canvas.height * scaleToFit;
const x = (pageWidth - imgWidth) / 2;
const y = (pageHeight - imgHeight) / 2;
pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight, undefined, "FAST");

    pdf.save("declaracao_insuficiencia_economica.pdf");
  } catch (e){
    console.error(e);
    mostrarToast("Não foi possível gerar o PDF. Tente novamente.");
  } finally {
    btn.disabled = false;
    btn.querySelector(".btn-label").classList.remove("d-none");
    btn.querySelector(".btn-spinner").classList.add("d-none");
  }
});

// Prefill data da declaração com hoje (mantém conforto)
(function prefillHoje(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  setDateParts("dataDeclaracao", `${yyyy}-${mm}-${dd}`);
})();
