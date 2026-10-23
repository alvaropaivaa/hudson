import { useState } from 'react'
import { IconForm, IconShield, IconWhatsApp } from './Icons'
import { waLink } from '../config'
import { INVESTIMENTOS, leadMessage, maskPhone, validName, validPhone } from '../lead'

export default function Diagnostico() {
  const [form, setForm] = useState({ nome: '', whats: '', empresa: '', investimento: '' })
  const [erro, setErro] = useState({})
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'whats' ? maskPhone(e.target.value) : e.target.value }))

  const enviar = (e) => {
    e.preventDefault()
    const novoErro = {}
    if (!validName(form.nome)) novoErro.nome = 'Digite seu nome'
    if (!validPhone(form.whats)) novoErro.whats = 'Digite um WhatsApp válido com DDD'
    setErro(novoErro)
    if (Object.keys(novoErro).length) return
    window.open(waLink(leadMessage(form)), '_blank', 'noopener')
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
          <button type="submit" className="cta-btn cta-primary diag-submit">
            <span className="cta-fill" aria-hidden="true" />
            <span className="cta-label">Quero meu diagnóstico</span>
            <span className="cta-chip" aria-hidden="true">
              <IconWhatsApp size={18} />
            </span>
          </button>
          <p className="diag-safe">
            <IconShield size={15} /> Seus dados são usados só para o contato.
          </p>
        </form>
      </div>
    </section>
  )
}
