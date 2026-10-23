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
