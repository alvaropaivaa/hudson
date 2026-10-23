import { useEffect, useState } from 'react'
import { Brand } from './Header'
import { AnchorLink, CtaButton } from './Cta'
import { IconArrowUp, IconInstagram } from './Icons'
import { SITE, waLink } from '../config'

export function Footer() {
  return (
    <footer className="footer" id="contato">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand dark />
            <p>{SITE.cargo}</p>
            <p className="footer-bio">{SITE.bio}</p>
          </div>
          <nav className="footer-col" aria-label="Navegação">
            <AnchorLink to="top">Início</AnchorLink>
            <AnchorLink to="funil">Como funciona</AnchorLink>
            <AnchorLink to="plano">Plano de ação</AnchorLink>
          </nav>
          <nav className="footer-col" aria-label="Seções">
            <AnchorLink to="diferenciais">Diferenciais</AnchorLink>
            <AnchorLink to="diagnostico">Diagnóstico</AnchorLink>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>{new Date().getFullYear()} © {SITE.nome}. Todos os direitos reservados.</p>
          <div className="footer-actions">
            {SITE.instagram && (
              <a
                className="footer-insta"
                href={`https://www.instagram.com/${SITE.instagram}/`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="footer-insta-chip">
                  <IconInstagram />
                </span>
                <span>{SITE.instagram}</span>
              </a>
            )}
            <AnchorLink to="top" className="footer-top-btn" aria-label="Voltar ao topo">
              <IconArrowUp />
            </AnchorLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Barra fixa com CTA: aparece depois do hero e some quando o rodapé ou o formulário estão na tela.
export function FloatingBar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('top')
    const hide = [document.getElementById('diagnostico'), document.querySelector('.footer')].filter(Boolean)
    const state = { heroOut: false, hidden: new Set() }
    const update = () => setShow(state.heroOut && state.hidden.size === 0)
    const ioHero = new IntersectionObserver(([e]) => {
      state.heroOut = !e.isIntersecting
      update()
    })
    const ioHide = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? state.hidden.add(e.target) : state.hidden.delete(e.target)))
      update()
    })
    if (hero) ioHero.observe(hero)
    hide.forEach((el) => ioHide.observe(el))
    return () => {
      ioHero.disconnect()
      ioHide.disconnect()
    }
  }, [])

  return (
    <div className={`floating-bar ${show ? 'is-visible' : ''}`} aria-hidden={!show}>
      <Brand className="brand--small" />
      <CtaButton href={waLink()} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1}>
        Falar no WhatsApp
      </CtaButton>
    </div>
  )
}
