import { IconArrowUpRight } from './Icons'
import { scrollToId } from '../config'

// Botão principal do arquivo base: pílula branca, preenchimento violeta no hover e chip com seta.
export function CtaButton({ href, children, className = '', ...rest }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag className={`cta-btn cta-primary ${className}`} href={href} {...rest}>
      <span className="cta-fill" aria-hidden="true" />
      <span className="cta-label">{children}</span>
      <span className="cta-chip" aria-hidden="true">
        <IconArrowUpRight />
      </span>
    </Tag>
  )
}

// Link interno com rolagem suave (Lenis).
export function AnchorLink({ to, children, onNavigate, ...rest }) {
  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault()
        if (onNavigate) {
          // fecha o menu primeiro: reativar o Lenis cancelaria uma rolagem já iniciada
          onNavigate()
          setTimeout(() => scrollToId(to), 40)
        } else scrollToId(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

export function CtaToForm({ children = 'Quero saber mais', className = '' }) {
  return (
    <CtaButton
      href="#diagnostico"
      className={className}
      onClick={(e) => {
        e.preventDefault()
        scrollToId('diagnostico')
      }}
    >
      {children}
    </CtaButton>
  )
}
