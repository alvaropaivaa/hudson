// Proteção contra cópia da LP.
// Não existe bloqueio 100% (o navegador sempre recebe o site), mas isto trava os jeitos comuns de clonar:
//  1) trava de domínio: cópia aberta do computador (file://) ou hospedada em outro domínio volta para o site original.
//     Os domínios ficam guardados como hash (não aparecem em texto no código, então "procurar e trocar" não desativa);
//  2) bloqueio de botão direito, seleção/cópia de texto, arrastar imagem e atalhos de salvar/código-fonte/inspecionar.
// Para liberar um domínio novo, inclua o hash dele em HOSTS (veja o README).

const h = (s) => {
  let x = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i)
    x = Math.imul(x, 0x01000193) >>> 0
  }
  return x
}

// jonhestrategiadigital.com.br, www.jonhestrategiadigital.com.br, localhost, 127.0.0.1
const HOSTS = [4186344214, 891643925, 22050618, 144953630]
// prévias da Vercel: hudson-*.vercel.app e jonh-trafego*.vercel.app
const PREVIEW_PREFIX = [3427322026, 3239143104]
const PREVIEW_SUFFIX = 3840610595
// endereço do site original, embaralhado
const HOME = [127, 99, 99, 103, 100, 45, 56, 56, 96, 96, 96, 57, 125, 120, 121, 127, 114, 100, 99, 101, 118, 99, 114, 112, 126, 118, 115, 126, 112, 126, 99, 118, 123, 57, 116, 120, 122, 57, 117, 101, 56]

export function hostOk() {
  const host = location.hostname
  if (location.protocol === 'file:' || !host) return false
  if (HOSTS.includes(h(host))) return true
  if (/^192\.168\.\d+\.\d+$/.test(host)) return true // celular na mesma rede, em testes
  return h(host.slice(-11)) === PREVIEW_SUFFIX && PREVIEW_PREFIX.includes(h(host.split(/[-.]/)[0]))
}

// Cópia fora do domínio: apaga a página e manda para o site original. Retorna false para não montar o React.
export function guard() {
  if (hostOk()) return true
  try {
    document.documentElement.innerHTML = ''
  } catch {
    /* segue para o redirecionamento */
  }
  location.replace(String.fromCharCode(...HOME.map((c) => c ^ 23)))
  return false
}

const editable = (el) => el?.closest?.('input, textarea, select, [contenteditable="true"]')

export function blockCopy() {
  const stop = (e) => {
    if (!editable(e.target)) e.preventDefault()
  }
  document.addEventListener('contextmenu', stop)
  document.addEventListener('copy', stop)
  document.addEventListener('cut', stop)
  document.addEventListener('selectstart', stop)
  document.addEventListener('dragstart', (e) => e.target?.tagName === 'IMG' && e.preventDefault())
  document.addEventListener(
    'keydown',
    (e) => {
      const k = (e.key || '').toLowerCase()
      const mod = e.ctrlKey || e.metaKey
      const devtools =
        k === 'f12' ||
        (mod && e.shiftKey && ['i', 'j', 'c', 'k'].includes(k)) ||
        (e.metaKey && e.altKey && ['i', 'j', 'c', 'u'].includes(k))
      const sourceOrSave = mod && !e.shiftKey && ['s', 'u', 'p'].includes(k)
      if (devtools || sourceOrSave) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    true,
  )
}
