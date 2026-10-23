// Recebe os contatos da LP e salva cada um como uma linha nesta planilha.
// Como instalar: veja o README do projeto (seção "Receber os contatos numa planilha do Google").

// ID da planilha (o trecho entre /d/ e /edit no link). Assim funciona mesmo se o projeto foi criado fora da planilha.
// Fica vazio no repositório (que é público): cole o ID só no script dentro do Google.
const PLANILHA_ID = ''
const ABA = 'Contatos'
// Opcional: coloque um e-mail aqui para receber um aviso a cada contato novo (o Gmail notifica no celular).
const EMAIL_AVISO = ''

const CABECALHO = ['Data', 'Nome', 'WhatsApp', 'Empresa/segmento', 'Investimento em anúncios', 'Origem', 'Responder no WhatsApp']

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)
  try {
    let d = {}
    try {
      d = JSON.parse((e && e.postData && e.postData.contents) || '{}')
    } catch (err) {
      return resposta_(false)
    }
    // campo invisível do formulário: só robô preenche
    if (d.site) return resposta_(true)

    const nome = limpa_(d.nome, 80)
    const whats = limpa_(d.whats, 25)
    if (nome.length < 2 || whats.replace(/\D/g, '').length < 10) return resposta_(false)
    const empresa = limpa_(d.empresa, 120)
    const investimento = limpa_(d.investimento, 60)
    const origem = limpa_(d.origem, 30)

    const digitos = whats.replace(/\D/g, '')
    const link = 'https://wa.me/' + (digitos.indexOf('55') === 0 && digitos.length > 11 ? digitos : '55' + digitos)

    const planilha = PLANILHA_ID ? SpreadsheetApp.openById(PLANILHA_ID) : SpreadsheetApp.getActiveSpreadsheet()
    const aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA)
    if (aba.getLastRow() === 0) {
      aba.appendRow(CABECALHO)
      aba.setFrozenRows(1)
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold')
    }
    aba.appendRow([new Date(), seguro_(nome), seguro_(whats), seguro_(empresa), seguro_(investimento), seguro_(origem), link])

    if (EMAIL_AVISO) {
      MailApp.sendEmail(
        EMAIL_AVISO,
        'Novo contato pela LP: ' + nome,
        ['Nome: ' + nome, 'WhatsApp: ' + whats, 'Empresa/segmento: ' + (empresa || '-'), 'Investimento: ' + (investimento || '-'), '', 'Responder: ' + link].join('\n'),
      )
    }
    return resposta_(true)
  } finally {
    lock.releaseLock()
  }
}

function limpa_(v, max) {
  return String(v == null ? '' : v)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, max)
}

// Texto que começa com = + - @ viraria fórmula na planilha (ex.: "+55..."): força como texto.
function seguro_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v
}

function resposta_(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok })).setMimeType(ContentService.MimeType.JSON)
}
