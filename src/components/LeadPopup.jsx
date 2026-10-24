import { useEffect, useRef, useState } from 'react'
import { IconArrowLeft, IconArrowUpRight, IconCheck, IconShield, IconWhatsApp, IconX } from './Icons'
import { waLink } from '../config'
import { INVESTIMENTOS, goToThanks, leadMessage, maskPhone, sendLead, validName, validPhone } from '../lead'

// Pop-up de entrada: o mesmo diagnóstico da página, uma pergunta por vez (1 → 2 → 3 → 4).
const STEPS = [
  {
    key: 'nome',
    q: 'Como posso te chamar?',
    placeholder: 'Seu nome',
    autoComplete: 'name',
    valid: validName,
    err: 'Digite seu nome',
  },
  {
    key: 'whats',
    q: 'Qual é o seu WhatsApp?',
    placeholder: '(00) 00000-0000',
    type: 'tel',
    inputMode: 'tel',
    autoComplete: 'tel-national',
    valid: validPhone,
    err: 'Digite um WhatsApp válido com DDD',
  },
  {
    key: 'empresa',
    q: 'Qual é a sua empresa ou segmento?',
    placeholder: 'Ex.: Clínica, loja de roupas, restaurante...',
    autoComplete: 'organization',
    valid: validName,
    err: 'Conte qual é o seu negócio',
  },
  {
    key: 'investimento',
    q: 'Quanto você investe hoje em anúncios?',
    options: INVESTIMENTOS,
    valid: (v) => !!v,
    err: 'Escolha uma opção',
  },
]

// abre em toda entrada/atualização da página (pedido do cliente)
const OPEN_DELAY = 1200

export default function LeadPopup() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ nome: '', whats: '', empresa: '', investimento: '' })
  const [erro, setErro] = useState('')
  const [sending, setSending] = useState(false)
  const inputRef = useRef(null)
  const dialogRef = useRef(null)
  const touched = useRef(false)

  const close = () => setOpen(false)

  // abre logo depois que a pessoa entra na página
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), OPEN_DELAY)
    return () => clearTimeout(t)
  }, [])

  // trava a rolagem da página por trás e fecha com Esc
  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement
    window.__lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      window.__lenis?.start()
      prevFocus?.focus?.()
    }
  }, [open])

  // foco: no PC já vai direto para o campo; no celular só depois do primeiro toque (não abre o teclado sozinho)
  useEffect(() => {
    if (!open) return
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (inputRef.current && (finePointer || touched.current)) inputRef.current.focus()
    else dialogRef.current?.focus()
  }, [open, step])

  if (!open) return null

  const done = step >= STEPS.length
  const cur = STEPS[step]
  const firstName = data.nome.trim().split(' ')[0]

  const setValue = (v) => {
    setErro('')
    setData((d) => ({ ...d, [cur.key]: cur.key === 'whats' ? maskPhone(v) : v }))
  }

  const next = async (e) => {
    e?.preventDefault()
    if (sending) return
    touched.current = true
    if (!cur.valid(data[cur.key])) return setErro(cur.err)
    setErro('')
    if (step < STEPS.length - 1) return setStep(step + 1)
    setSending(true)
    const ok = await sendLead({ ...data, origem: 'Pop-up' })
    // salvou: página de obrigado. Não salvou: plano B, o cliente envia pelo WhatsApp dele
    if (ok) return goToThanks(data.nome)
    setSending(false)
    setStep(STEPS.length)
  }

  const back = () => {
    touched.current = true
    setErro('')
    setStep((s) => Math.max(0, s - 1))
  }

  return (
    <div className="lp-overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="lp-dialog" role="dialog" aria-modal="true" aria-labelledby="lp-title" ref={dialogRef} tabIndex={-1}>
        <button type="button" className="lp-close" aria-label="Fechar" onClick={close}>
          <IconX />
        </button>

        <div className="lp-head">
          <span className="diag-tag">Diagnóstico gratuito</span>
          <p>Leva menos de um minuto.</p>
        </div>
        <h2 id="lp-title">
          Descubra como sua empresa pode <span>vender mais</span> com tráfego pago
        </h2>

        <ol className="lp-steps" aria-label={`Etapa ${Math.min(step + 1, STEPS.length)} de ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <li key={s.key} className={i < step ? 'is-done' : i === step ? 'is-current' : ''}>
              <span>{i < step ? <IconCheck size={13} /> : i + 1}</span>
            </li>
          ))}
        </ol>

        {done ? (
          <div className="lp-body lp-done" key="done">
            <span className="lp-done-ico" aria-hidden="true">
              <IconWhatsApp size={30} />
            </span>
            <h3>Falta só um passo, {firstName}!</h3>
            <p>Toque no botão abaixo para enviar suas respostas pelo WhatsApp e agendarmos o seu diagnóstico.</p>
            <a
              className="cta-btn cta-primary lp-main"
              href={waLink(leadMessage(data))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setTimeout(() => goToThanks(data.nome), 400)}
            >
              <span className="cta-fill" aria-hidden="true" />
              <span className="cta-label">Enviar pelo WhatsApp</span>
              <span className="cta-chip" aria-hidden="true">
                <IconWhatsApp size={18} />
              </span>
            </a>
            <button type="button" className="lp-link" onClick={close}>
              Voltar para o site
            </button>
          </div>
        ) : (
          <form className="lp-body" key={step} onSubmit={next} noValidate>
            <label className="lp-q" htmlFor={cur.options ? undefined : 'lp-input'} id="lp-q">
              <small>Pergunta {step + 1} de {STEPS.length}</small>
              {cur.q}
            </label>

            {cur.options ? (
              <div className="lp-options" role="radiogroup" aria-labelledby="lp-q">
                {cur.options.map((o) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={data.investimento === o}
                    className={`lp-option ${data.investimento === o ? 'is-selected' : ''}`}
                    key={o}
                    onClick={() => setValue(o)}
                  >
                    {o}
                    <i aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : (
              <div className={`field ${erro ? 'has-error' : ''}`}>
                <input
                  id="lp-input"
                  ref={inputRef}
                  type={cur.type || 'text'}
                  inputMode={cur.inputMode}
                  autoComplete={cur.autoComplete}
                  placeholder={cur.placeholder}
                  value={data[cur.key]}
                  onChange={(e) => setValue(e.target.value)}
                  aria-invalid={!!erro}
                />
              </div>
            )}
            {erro && (
              <small className="lp-error" role="alert">
                {erro}
              </small>
            )}

            <div className="lp-actions">
              {step > 0 && (
                <button type="button" className="lp-back" onClick={back} aria-label="Voltar">
                  <IconArrowLeft />
                </button>
              )}
              <button type="submit" className="cta-btn cta-primary lp-main" disabled={sending} aria-busy={sending}>
                <span className="cta-fill" aria-hidden="true" />
                <span className="cta-label">
                  {step < STEPS.length - 1 ? 'Continuar' : sending ? 'Enviando...' : 'Quero meu diagnóstico'}
                </span>
                <span className="cta-chip" aria-hidden="true">
                  {step < STEPS.length - 1 ? <IconArrowUpRight /> : <IconWhatsApp size={18} />}
                </span>
              </button>
            </div>
          </form>
        )}

        <p className="diag-safe">
          <IconShield size={15} /> Seus dados são usados só para o contato.
        </p>
      </div>
    </div>
  )
}
