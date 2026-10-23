import LazyScene from './LazyScene'
import { CtaToForm } from './Cta'
import { IconArrowUpRight, IconCheck, IconTrend, IconWhatsApp } from './Icons'
import { waLink } from '../config'

const loadGrowth = () => import('../three/GrowthScene')
const loadFunnel = () => import('../three/FunnelScene')
const loadTarget = () => import('../three/TargetScene')

/* ---------- PENSE NISSO (branca) ---------- */
export function Value() {
  return (
    <section className="value" id="vantagens" aria-labelledby="value-title">
      <div className="value-inner">
        <div className="value-left" data-reveal>
          <span className="value-tag">Pense nisso</span>
          <h2 id="value-title">
            Ter um ótimo produto
            <br />
            não basta. <span>As pessoas certas precisam ver.</span>
          </h2>
          <div className="value-social">
            <span className="value-social-ico" aria-hidden="true">
              <IconTrend size={18} />
            </span>
            <p>+R$ 100 mil gerenciados em tráfego pago</p>
          </div>
        </div>
        <div className="value-copy" data-reveal>
          <p className="value-lead">
            Você pode ter um ótimo serviço, um ótimo produto e potencial para vender muito mais. Mas se o seu anúncio
            aparece para as pessoas erradas, ou se tudo o que você faz é apertar o botão de impulsionar e torcer, o
            dinheiro vai embora e os clientes não chegam.
          </p>
          <p className="value-muted">
            A minha missão é colocar a sua empresa na frente de quem está pronto para comprar, com campanhas
            estratégicas, otimização constante e foco no que realmente importa: vendas.
          </p>
          <a className="value-cta" href={waLink()} target="_blank" rel="noopener noreferrer">
            Quero vender mais
            <span aria-hidden="true">
              <IconArrowUpRight />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------- ANÚNCIO CERTO (seção "carteira" do base, com gráfico 3D) ---------- */
const LINES = [
  ['Anúncio ', 'certo ', 'faz'],
  ['sua ', 'empresa'],
  ['vender ', 'muito ', 'mais'],
]

export function Growth() {
  return (
    <section className="wallet" aria-labelledby="wallet-title">
      <h2 className="wallet-headline" id="wallet-title">
        {LINES.map((words, i) => (
          <span className="wallet-line" key={i}>
            {words.map((w) => (
              <span className="wallet-word" key={w}>
                {w}
              </span>
            ))}
          </span>
        ))}
      </h2>
      <LazyScene load={loadGrowth} className="wallet-art" />
      <div className="wallet-left" data-reveal>
        <p>
          Seu anúncio aparecendo para quem tem
          <br />
          interesse de verdade no que você vende.
        </p>
      </div>
      <div className="wallet-right" data-reveal>
        <p>Menos dinheiro desperdiçado. Mais pessoas virando clientes.</p>
        <a className="wallet-cta" href={waLink()} target="_blank" rel="noopener noreferrer">
          Quero anunciar certo
          <span className="wallet-cta-chip" aria-hidden="true">
            <IconArrowUpRight size={16} />
          </span>
        </a>
      </div>
    </section>
  )
}

/* ---------- NÚMEROS ---------- */
const STATS = [
  { pre: '+R$', n: 100, suf: 'K', label: 'Investidos em anúncios sob minha gestão' },
  { pre: '', n: 100, suf: '%', label: 'Estratégias personalizadas' },
  { pre: '', n: 24, suf: 'h', label: 'Seus anúncios trabalhando por você' },
  { pre: '', n: 3, suf: '', label: 'Etapas até o seu plano de ação' },
]

export function Stats() {
  return (
    <section className="stats" id="resultados" aria-label="Números">
      <div className="stats-container" data-reveal>
        <dl className="stats-grid">
          {STATS.map((s) => (
            <div className="stats-item" key={s.label}>
              <dt className="stats-value" aria-label={`${s.pre}${s.n}${s.suf}`}>
                <span aria-hidden="true">
                  {s.pre}
                  <span data-count={s.n}>{s.n}</span>
                  {s.suf}
                </span>
              </dt>
              <dd className="stats-label">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ---------- NUVENS (mesma transição do base: preto → branco) ---------- */
const A = 'assets/nuvem-a.webp'
const B = 'assets/nuvem-b.webp'
const CLOUDS = {
  back: [
    ['fc-b1', A],
    ['fc-b2', B],
    ['fc-b3', B],
    ['fc-b4', A],
    ['fc-b5', A],
    ['fc-b6', B],
  ],
  mid: [
    ['fc-center', B],
    ['fc-left', A],
    ['fc-right', A],
    ['fc-m1', B],
    ['fc-m2', B],
    ['fc-m3', A],
    ['fc-m4', B],
  ],
  front: [
    ['fc-f1', A],
    ['fc-f2', B],
    ['fc-f3', A],
    ['fc-f4', B],
  ],
}

export function Clouds() {
  return (
    <section className="clouds" aria-hidden="true">
      <div className="clouds-wrap">
        {Object.entries(CLOUDS).map(([layer, items]) => (
          <div className={`clouds-layer clouds-layer--${layer}`} key={layer}>
            {items.map(([cls, src]) => (
              <img key={cls} className={`cloud ${cls}`} src={src} alt="" decoding="async" draggable="false" />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- FUNIL 3D (branca, no lugar dos projetos do base) ---------- */
const FUNNEL = [
  ['Atração', 'Seu anúncio chega até as pessoas com o perfil certo para comprar de você.'],
  ['Interesse', 'Mensagens e ofertas que prendem a atenção e fazem a pessoa querer saber mais.'],
  ['Conversão', 'O contato chega no seu WhatsApp, site ou loja pronto para fechar negócio.'],
]

export function Funnel() {
  return (
    <section className="funnel" id="funil" aria-labelledby="funnel-title">
      <h2 className="light-headline" id="funnel-title" data-reveal>
        Tráfego pago não é sorte.
        <br />
        <span className="light-grad">É método.</span>
      </h2>
      <p className="light-sub" data-reveal>
        Cada campanha é um funil pensado para <strong>transformar desconhecidos em clientes.</strong>
      </p>
      <div className="funnel-body">
        <LazyScene load={loadFunnel} className="funnel-3d" />
        <ol className="funnel-steps">
          {FUNNEL.map(([t, d], i) => (
            <li className="funnel-step" key={t} data-reveal>
              <span className="funnel-num" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- PLANO DE AÇÃO (estilo da linha do tempo do base) ---------- */
const PLAN = [
  {
    title: 'Entendendo onde você está',
    items: [
      'Analiso a situação atual do seu negócio',
      'Identifico os principais gargalos de vendas',
      'Mapeio o que está limitando seu crescimento',
    ],
  },
  {
    title: 'O que sua empresa realmente precisa',
    items: [
      'Mostro exatamente o que precisa ser feito',
      'Defino o próximo passo mais estratégico',
      'Alinho as prioridades com a sua realidade',
    ],
  },
  {
    title: 'Plano de ação estratégico',
    items: [
      'Você recebe um plano claro, com os próximos passos',
      'Canais, públicos e investimento bem definidos',
      'Campanhas no ar com acompanhamento constante',
    ],
  },
]

export function Plan() {
  return (
    <section className="process" id="plano" aria-labelledby="plan-title">
      <div className="process-inner">
        <h2 id="plan-title" data-reveal>
          Receba um plano de ação claro e estratégico:
          <br />
          <span>feito para sua empresa escalar.</span>
        </h2>
        <div className="process-stage">
          <span className="process-line" aria-hidden="true">
            <span className="process-line-active" />
          </span>
          <ol className="process-list">
            {PLAN.map((step, i) => (
              <li className="process-step" key={step.title} data-reveal>
                <span className="process-number" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="process-step-copy">
                  <h3>{step.title}</h3>
                  <ul>
                    {step.items.map((it) => (
                      <li key={it}>
                        <IconCheck size={14} />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="process-cta" data-reveal>
          <CtaToForm>Quero meu plano de ação</CtaToForm>
        </div>
      </div>
    </section>
  )
}

/* ---------- POR QUE EU (cartão preto arredondado do base) ---------- */
function WhyCard({ children, media }) {
  return (
    <article className="why-card" data-reveal>
      {children}
      <div className="why-media" aria-hidden="true">
        {media}
      </div>
      <div className="why-card-glow" aria-hidden="true" />
    </article>
  )
}

export function Why() {
  return (
    <section className="why" id="diferenciais" aria-labelledby="why-title" data-anim>
      <div className="why-head" data-reveal>
        <h2 className="why-headline" id="why-title">
          Por que você
          <br />
          deve escolher
          <br />
          <span className="why-grad">trabalhar comigo?</span>
        </h2>
      </div>
      <div className="why-grid">
        <WhyCard media={<TargetingUI />}>
          <h3>Estratégia antes do anúncio</h3>
          <p className="why-card-text">
            Antes de investir o primeiro real, eu estudo o seu negócio, o seu público e a sua concorrência para anunciar
            com direção.
          </p>
        </WhyCard>
        <WhyCard media={<DashboardUI />}>
          <h3>Decisões baseadas em dados</h3>
          <p className="why-card-text">
            Nada de achismo. Acompanho as métricas das campanhas e ajusto o que for preciso para o seu dinheiro render
            mais.
          </p>
        </WhyCard>
        <WhyCard media={<FeedUI />}>
          <h3>Foco em escala de vendas</h3>
          <p className="why-card-text">
            Meu objetivo não é só gerar cliques: é trazer clientes e criar previsibilidade para a sua empresa crescer.
          </p>
        </WhyCard>
      </div>
      <div className="why-cta-row" data-reveal>
        <CtaToForm>Quero saber mais</CtaToForm>
      </div>
    </section>
  )
}

/* ---------- Ilustrações dos cards (HTML/CSS, sem 3D) ---------- */
const CHIPS = ['Público ideal', 'Interesses', 'Região', 'Concorrência']

function TargetingUI() {
  return (
    <div className="ui-target">
      <svg className="ui-target-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M50 52 L22 20" />
        <path d="M50 52 L79 24" />
        <path d="M50 52 L21 82" />
        <path d="M50 52 L80 79" />
      </svg>
      <span className="ui-orbit ui-orbit--1" />
      <span className="ui-orbit ui-orbit--2" />
      <span className="ui-core">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </svg>
      </span>
      {CHIPS.map((c, i) => (
        <span className={`ui-chip ui-chip--${i + 1}`} key={c}>
          <i />
          {c}
        </span>
      ))}
    </div>
  )
}

const KPIS = [
  ['CTR', 'up'],
  ['Custo/lead', 'down'],
  ['Retorno', 'up'],
]

function DashboardUI() {
  return (
    <div className="ui-dash">
      <div className="ui-dash-top">
        <span>Desempenho da campanha</span>
        <span className="ui-live">
          <i />
          Ao vivo
        </span>
      </div>
      <div className="ui-kpis">
        {KPIS.map(([k, dir]) => (
          <div className="ui-kpi" key={k}>
            <span>{k}</span>
            <b className={`ui-trend ui-trend--${dir}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {dir === 'up' ? <path d="m5 15 7-7 7 7" /> : <path d="m5 9 7 7 7-7" />}
              </svg>
              <em />
            </b>
          </div>
        ))}
      </div>
      <div className="ui-chart-wrap">
        <svg className="ui-chart" viewBox="0 0 300 92" preserveAspectRatio="none">
        <defs>
          <linearGradient id="uiArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9d6bff" stopOpacity=".45" />
            <stop offset="1" stopColor="#9d6bff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="ui-chart-grid" d="M0 23H300M0 46H300M0 69H300" />
        <path className="ui-chart-area" d="M0 80 C30 76 45 70 70 66 S110 58 130 50 S170 44 190 34 S240 18 300 8 V92 H0Z" fill="url(#uiArea)" />
        <path
          className="ui-chart-line"
          pathLength="1"
          d="M0 80 C30 76 45 70 70 66 S110 58 130 50 S170 44 190 34 S240 18 300 8"
        />
        </svg>
        <span className="ui-chart-dot" />
        <span className="ui-chart-tip">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Campanha otimizada
        </span>
      </div>
    </div>
  )
}

const FEED = [
  ['wa', 'Novo contato', 'chegou pelo WhatsApp', 'agora'],
  ['sale', 'Venda realizada', 'cliente do Instagram', '1 min'],
  ['lead', 'Novo lead', 'formulário preenchido', '3 min'],
  ['wa', 'Novo contato', 'veio do remarketing', '5 min'],
  ['sale', 'Venda realizada', 'cliente novo', '8 min'],
]

const FEED_ICONS = {
  sale: (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  lead: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21c1-4 4-6 7-6s6 2 7 6" />
      <path d="M19 8v6M22 11h-6" />
    </>
  ),
}

function FeedUI() {
  // lista duplicada: a animação sobe meia altura e reinicia sem "pulo"
  const items = [...FEED, ...FEED]
  return (
    <div className="ui-feed">
      <div className="ui-feed-track">
        {items.map(([kind, title, sub, time], i) => (
          <div className="ui-note" key={i}>
            <span className={`ui-note-ico ui-note-ico--${kind}`}>
              {kind === 'wa' ? (
                <IconWhatsApp size={19} />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {FEED_ICONS[kind]}
                </svg>
              )}
            </span>
            <span className="ui-note-copy">
              <b>{title}</b>
              <small>{sub}</small>
            </span>
            <time>{time}</time>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- IMPULSIONAR x ESTRATÉGIA (seção "gateways" do base) ---------- */
const FEATURES = [
  [
    'Cuidado com o botão impulsionar.',
    'Impulsionar post sem estratégia entrega o seu anúncio para quem não vai comprar. É dinheiro saindo sem retorno.',
  ],
  [
    'Seu concorrente já está anunciando.',
    'Enquanto você espera o cliente aparecer, ele está sendo impactado pelos anúncios da concorrência.',
  ],
  [
    'Previsibilidade de vendas.',
    'Com campanhas bem estruturadas, você acompanha quanto investe e quanto retorna, e para de depender da sorte.',
  ],
]

export function Strategy() {
  return (
    <section className="gateways" id="estrategia" aria-labelledby="gateways-title" data-anim>
      <div className="gateways-head" data-reveal>
        <h2 className="gateways-headline" id="gateways-title">
          Sua empresa aparecendo para{' '}
          <br />
          quem está <span className="light-grad">pronto para comprar</span>
        </h2>
        <p className="gateways-sub">
          Com tráfego pago estratégico, sua empresa aparece no momento em que o cliente procura pelo que você vende.
        </p>
      </div>
      <div className="gateways-panel" data-reveal>
        <div className="gateways-panel-bg" aria-hidden="true">
          <span className="stripe stripe--1" />
          <span className="stripe stripe--2" />
          <span className="stripe stripe--3" />
          <span className="stripe stripe--4" />
        </div>
        <div className="gateways-dash" aria-hidden="true">
          <div className="dash-card dash-card--a">
            <span className="dash-label" />
            <svg viewBox="0 0 200 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#7a2cff" stopOpacity=".28" />
                  <stop offset="1" stopColor="#7a2cff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 60 C30 55 40 48 65 46 S110 30 130 28 S170 12 200 6 V70 H0Z" fill="url(#dashFill)" />
              <path
                className="dash-line"
                d="M0 60 C30 55 40 48 65 46 S110 30 130 28 S170 12 200 6"
                fill="none"
                stroke="#7a2cff"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <div className="dash-card dash-card--b">
            <span className="dash-ring" />
            <span className="dash-label" />
          </div>
        </div>
        <div className="gateways-panel-copy">
          <h3>
            Marketing,
            <br />
            performance e escala
            <br />
            de negócios
          </h3>
          <p>Do planejamento à otimização diária das suas campanhas.</p>
        </div>
      </div>
      <div className="gateways-features">
        {FEATURES.map(([t, d]) => (
          <article className="gateways-feature" key={t} data-reveal>
            <h4>{t}</h4>
            <p>{d}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------- OBJETIVO (seção da "mão" do base, com alvo 3D) ---------- */
export function Goal() {
  return (
    <section className="brand-hand" aria-labelledby="goal-title">
      <div className="brand-hand-inner">
        <div className="brand-hand-copy" data-reveal>
          <h2 id="goal-title">
            Meu objetivo é aumentar
            <br />
            seus <span>resultados.</span>
          </h2>
          <p>
            Cada empresa tem um objetivo diferente. Por isso, eu busco entender o que precisa acontecer para o seu
            investimento em anúncios gerar retorno.
          </p>
        </div>
        <LazyScene load={loadTarget} className="brand-hand-art" />
      </div>
    </section>
  )
}

