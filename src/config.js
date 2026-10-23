// Dados do Jonh — edite aqui e o site inteiro atualiza.
export const SITE = {
  nome: 'Jonh',
  cargo: 'Gestor de Tráfego | Estrategista Digital',
  bio: 'Marketing, performance e escala de negócios.',
  // WhatsApp do Jonh: +55 85 9439-9609 (DDI + DDD + número, só dígitos, como aparece no WhatsApp dele)
  whatsapp: '558594399609',
  // TODO: @ do Instagram sem o "@" (deixe vazio para esconder)
  instagram: '',
  mensagemPadrao: 'Olá, Jonh! Quero saber mais sobre a gestão de tráfego para a minha empresa.',
}

export const waLink = (msg = SITE.mensagemPadrao) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`

export const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -8, duration: 1.3 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
