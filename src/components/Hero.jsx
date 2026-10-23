import Header from './Header'
import { AnchorLink, CtaToForm } from './Cta'

// Mesmo hero do arquivo base: foto em tela cheia, texto enxuto à esquerda (no celular, embaixo e centralizado).
export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
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
