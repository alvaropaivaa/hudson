import { useState } from 'react'
import { IconForm, IconShield, IconWhatsApp } from './Icons'
import { waLink } from '../config'
import { INVESTIMENTOS, leadMessage, maskPhone, sendLead, validName, validPhone } from '../lead'

export default function Diagnostico() {
  const [form, setForm] = useState({ nome: '', whats: '', empresa: '', investimento: '' })
  const [erro, setErro] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(null) // 'auto' = salvo na planilha do Jonh; 'manual' = cliente envia
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'whats' ? maskPhone(e.target.value) : e.target.value }))

  const enviar = async (e) => {
    e.preventDefault()
    if (sending) return
    const novoErro = {}
    if (!validName(form.nome)) novoErro.nome = 'Digite seu nome'
    if (!validPhone(form.whats)) novoErro.whats = 'Digite um WhatsApp válido com DDD'
    setErro(novoErro)
    if (Object.keys(novoErro).length) return
    setSending(true)
    // "site" é um campo invisível: só robô preenche (o servidor descarta)
    const ok = await sendLead({ ...form, origem: 'Formulário', site: e.currentTarget?.site?.value || '' })
    setSending(false)
    setSent(ok ? 'auto' : 'manual')
  }

  return (
    <section className="diag" id="diagnostico" aria-labelledby="diag-title">
      <div className="diag-inner">
        <div className="diag-left" data-reveal>
          <h2 id="diag-title">
            Receba seu diagnóstico em <span className="grad">apenas um minuto!</span>
          </h2>
          <ol className="diag-steps">
            <li>
              <span className="diag-ico" aria-hidden="true">
                <IconForm />
              </span>
              <div>
                <h3>
                  Preencha o <span className="grad">formulário</span>
                </h3>
                <p>Envie suas informações de contato. Todos os seus dados estarão seguros, vou cuidar bem deles.</p>
              </div>
            </li>
            <li>
              <span className="diag-ico" aria-hidden="true">
                <IconWhatsApp size={22} />
              </span>
              <div>
                <h3>
                  Receba o meu <span className="grad">contato</span>
                </h3>
                <p>
                  Em até 1 hora eu te respondo no WhatsApp para agendarmos uma conversa e preparar o seu diagnóstico.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <form className="diag-form" onSubmit={enviar} noValidate data-reveal>
          <div className="diag-form-head">
            <span className="diag-tag">Diagnóstico gratuito</span>
            <p>Leva menos de um minuto.</p>
          </div>
          {sent ? (
            <div className="diag-done" role="status">
              <span className="lp-done-ico" aria-hidden="true">
                <IconWhatsApp size={28} />
              </span>
              <h3>{sent === 'auto' ? `Recebido, ${form.nome.trim().split(' ')[0]}!` : 'Falta só um passo!'}</h3>
              <p>
                {sent === 'auto'
                  ? 'Suas respostas chegaram para mim. Em breve eu te chamo no WhatsApp para agendarmos o seu diagnóstico.'
                  : 'Toque no botão abaixo para enviar suas respostas pelo WhatsApp e agendarmos o seu diagnóstico.'}
              </p>
              <a
                className={`cta-btn cta-primary diag-submit ${sent === 'auto' ? 'lp-main--ghost' : ''}`}
                href={waLink(leadMessage(form))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="cta-fill" aria-hidden="true" />
                <span className="cta-label">{sent === 'auto' ? 'Falar comigo agora no WhatsApp' : 'Enviar pelo WhatsApp'}</span>
                <span className="cta-chip" aria-hidden="true">
                  <IconWhatsApp size={18} />
                </span>
              </a>
            </div>
          ) : (
            <>
          <input className="hp-field" type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className={`field ${erro.nome ? 'has-error' : ''}`}>
            <span>Seu nome *</span>
            <input
              type="text"
              name="nome"
              autoComplete="name"
              placeholder="Como posso te chamar?"
              value={form.nome}
              onChange={set('nome')}
              aria-invalid={!!erro.nome}
            />
            {erro.nome && <small role="alert">{erro.nome}</small>}
          </label>
          <label className={`field ${erro.whats ? 'has-error' : ''}`}>
            <span>WhatsApp *</span>
            <input
              type="tel"
              name="whatsapp"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(00) 00000-0000"
              value={form.whats}
              onChange={set('whats')}
              aria-invalid={!!erro.whats}
            />
            {erro.whats && <small role="alert">{erro.whats}</small>}
          </label>
          <label className="field">
            <span>Empresa ou segmento</span>
            <input
              type="text"
              name="empresa"
              autoComplete="organization"
              placeholder="Ex.: Clínica, loja de roupas, restaurante..."
              value={form.empresa}
              onChange={set('empresa')}
            />
          </label>
          <label className="field">
            <span>Quanto você investe hoje em anúncios?</span>
            <select name="investimento" value={form.investimento} onChange={set('investimento')}>
              <option value="">Selecione uma opção</option>
              {INVESTIMENTOS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="cta-btn cta-primary diag-submit" disabled={sending} aria-busy={sending}>
            <span className="cta-fill" aria-hidden="true" />
            <span className="cta-label">{sending ? 'Enviando...' : 'Quero meu diagnóstico'}</span>
            <span className="cta-chip" aria-hidden="true">
              <IconWhatsApp size={18} />
            </span>
          </button>
            </>
          )}
          <p className="diag-safe">
            <IconShield size={15} /> Seus dados são usados só para o contato.
          </p>
        </form>
      </div>
    </section>
  )
}
