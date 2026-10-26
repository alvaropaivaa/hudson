import { SITE } from './config'

// Usado pelo formulário da seção de diagnóstico e pelo pop-up de entrada.
export const INVESTIMENTOS = [
  'Ainda não invisto em anúncios',
  'Até R$ 1.000 por mês',
  'De R$ 1.000 a R$ 3.000 por mês',
  'De R$ 3.000 a R$ 10.000 por mês',
  'Acima de R$ 10.000 por mês',
]

export const maskPhone = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export const validName = (v) => v.trim().length >= 2
export const validPhone = (v) => v.replace(/\D/g, '').length >= 10

// Salva o lead na planilha do Google (Apps Script em google-apps-script/Code.gs).
// O Apps Script não libera CORS: o envio vai como "no-cors" + text/plain (sem preflight) e a
// resposta não pode ser lida — se a requisição saiu sem erro de rede, consideramos enviado.
// Retorna false se a planilha não estiver configurada ou a rede falhar: aí o site cai no plano B
// (o cliente envia as respostas pelo WhatsApp dele).
export async function sendLead(data) {
  if (!SITE.planilha) return false
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 9000)
  try {
    await fetch(SITE.planilha, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
      signal: ctrl.signal,
    })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

// Depois de salvar na planilha, leva para a página de obrigado (/obrigado/), que também serve
// para marcar conversão no Pixel/Google Ads. O primeiro nome vai na URL só para personalizar.
// Antes de sair, avisa o Google Tag Manager (evento "lead_enviado") para gatilhos de conversão.
export const goToThanks = (nome, origem) => {
  try {
    ;(window.dataLayer = window.dataLayer || []).push({ event: 'lead_enviado', origem_formulario: origem })
  } catch {
    /* sem GTM: segue normal */
  }
  window.location.assign(`obrigado/?nome=${encodeURIComponent(nome.trim().split(/\s+/)[0] || '')}`)
}

export const leadMessage = ({ nome, whats, empresa, investimento }) =>
  [
    `Olá, ${SITE.nome}! Quero receber meu diagnóstico de tráfego pago.`,
    '',
    `*Nome:* ${nome.trim()}`,
    `*WhatsApp:* ${whats}`,
    empresa.trim() && `*Empresa/segmento:* ${empresa.trim()}`,
    investimento && `*Investimento em anúncios:* ${investimento}`,
  ]
    .filter((l) => l !== false && l !== '')
    .join('\n')
