import Header from './Header'
import { AnchorLink, CtaToForm } from './Cta'
import { IconTrend } from './Icons'

// Mesmo hero do arquivo base: foto em tela cheia, texto enxuto à esquerda (no celular, embaixo e centralizado).
export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title" data-anim>
      <div className="hero-fx" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span className="hero-spark" key={i} style={{ '--i': i }} />
        ))}
        <div className="hero-badges">
          <div className="hero-badge hero-badge--money">
            <span className="hero-badge-ico">
              <IconTrend size={16} />
            </span>
            <span>
              <b>+R$ 100 mil</b>
              <small>gerenciados em tráfego pago</small>
            </span>
          </div>
          <div className="hero-badge hero-badge--live">
            <i />
            Campanhas no ar
          </div>
        </div>
      </div>

      <Header />
      <div className="hero-copy">
        <h1 id="hero-title">
          Aumente o faturamento
          <br />
          da sua empresa com
          <br />
          <span className="hero-grad">tráfego pago</span>
        </h1>
        <p>Entenda como sua empresa pode atrair mais clientes e vender mais com Tráfego Pago.</p>
        <div className="hero-ctas">
          <CtaToForm>Quero saber mais</CtaToForm>
          <AnchorLink to="funil" className="cta-btn cta-secondary">
            Como funciona
          </AnchorLink>
        </div>
      </div>
    </section>
  )
}
