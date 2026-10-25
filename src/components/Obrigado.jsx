import { Brand } from './Header'
import { CtaButton } from './Cta'
import { IconCheck, IconWhatsApp } from './Icons'
import { CREDITO, SITE, waLink } from '../config'

// Página de obrigado (/obrigado/): abre depois que o contato foi salvo na planilha.
// O primeiro nome chega pela URL (?nome=Maria) só para personalizar o título.
const firstName = () => {
  try {
    const n = new URLSearchParams(window.location.search).get('nome') || ''
    return n.trim().split(/\s+/)[0].slice(0, 30)
  } catch {
    return ''
  }
}

// 558594399609 → +55 85 9439-9609
const formatPhone = (d) => {
  const m = d.match(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/)
  return m ? `+${m[1]} ${m[2]} ${m[3]}-${m[4]}` : `+${d}`
}

const STEPS = [
  ['Respostas recebidas', 'Seu pedido de diagnóstico já está na minha lista.'],
  ['Análise do seu negócio', 'Vou olhar o seu segmento, o seu momento e quanto você investe hoje em anúncios.'],
  ['Conversa no WhatsApp', 'Te chamo para entender seus objetivos e mostrar o melhor caminho para vender mais.'],
]

export default function Obrigado() {
  const nome = firstName()
  return (
    <div className="ty">
      <div className="ty-bg" aria-hidden="true" />
      <header className="ty-nav">
        <a href="../" aria-label={`${SITE.nome}, voltar ao site`}>
          <Brand />
        </a>
      </header>

      <main className="ty-main">
        <div className="ty-check" aria-hidden="true">
          <IconCheck size={38} />
        </div>
        <span className="diag-tag">Diagnóstico solicitado</span>
        <h1>
          Recebido{nome ? ', ' : ''}
          <span className="hero-grad">{nome ? `${nome}!` : '!'}</span>
        </h1>
        <p className="ty-lead">
          Suas respostas chegaram para mim. Em breve eu te chamo no WhatsApp para agendarmos o seu diagnóstico
          gratuito.
        </p>

        <ol className="ty-steps">
          {STEPS.map(([t, d], i) => (
            <li key={t} className={i === 0 ? 'is-done' : ''}>
              <span className="ty-num">{i === 0 ? <IconCheck size={14} /> : i + 1}</span>
              <div>
                <h2>{t}</h2>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="ty-save">
          <IconWhatsApp size={16} /> Salve meu número para não perder a mensagem: <strong>{formatPhone(SITE.whatsapp)}</strong>
        </p>

        <div className="ty-ctas">
          <CtaButton href={waLink(`Olá, ${SITE.nome}! Acabei de pedir o diagnóstico pelo site.`)} target="_blank" rel="noopener noreferrer">
            Falar agora no WhatsApp
          </CtaButton>
          <a className="cta-btn cta-secondary" href="../">
            Voltar para o site
          </a>
        </div>
      </main>

      <footer className="ty-foot">
        {new Date().getFullYear()} © {SITE.nome}. {SITE.cargo}
        <a className="footer-credit" href={CREDITO.link} target="_blank" rel="noopener noreferrer">
          Feito por <strong>{CREDITO.nome}</strong>
        </a>
      </footer>
    </div>
  )
}
