# LP Jonh — Gestor de Tráfego

Landing page em React + Vite, com cenas 3D (three.js / React Three Fiber).

## Rodar e publicar

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera a pasta dist/ (é ela que vai para a hospedagem)
npm run preview  # testa a versão de produção localmente
```

A pasta `dist/` funciona em qualquer hospedagem estática (Vercel, Netlify, Hostinger, GitHub Pages…), inclusive dentro de uma subpasta.

## Receber os contatos numa planilha do Google (grátis)

Quando o cliente termina o pop-up ou o formulário, os dados viram uma linha numa planilha do Google: data, nome, WhatsApp, empresa, investimento, origem (pop-up ou formulário) e um link pra responder no WhatsApp. Enquanto a planilha não estiver ligada, o site usa o plano B: o cliente envia as respostas pelo WhatsApp dele.

1. Crie uma planilha em branco (sheets.new) na conta Google que vai receber os contatos.
2. Na planilha: **Extensões → Apps Script**. Apague o que estiver lá e cole o conteúdo de `google-apps-script/Code.gs`. Salve.
   - Opcional: em `EMAIL_AVISO`, coloque um e-mail para receber um aviso a cada contato novo.
3. **Implantar → Nova implantação →** tipo **App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   - Clique em Implantar e autorize o acesso à planilha (o Google mostra um aviso de "app não verificado": clique em *Avançado → Acessar*; o app é seu).
4. Copie a **URL do app da Web** (termina em `/exec`) e cole em `src/config.js`, no campo `planilha`. Depois rode `npm run build` e publique de novo.

A aba "Contatos" e o cabeçalho são criados sozinhos no primeiro contato.

## Página de obrigado

Depois que o contato é salvo, o cliente vai para `/obrigado/` (arquivo `obrigado/index.html`, componente `src/components/Obrigado.jsx`). Como ela só abre depois de um envio com sucesso, é o lugar do código de conversão do Pixel da Meta, Google Ads ou GTM: cole no `<head>` de `obrigado/index.html`, onde está o comentário.

## Onde editar

- `src/config.js`: nome, cargo, número de WhatsApp, Instagram e endereço da planilha de contatos (o site inteiro usa esses dados).
- `src/components/`: seções da página e o pop-up de diagnóstico (`LeadPopup.jsx`).
- `src/three/`: cenas 3D (gráfico, funil e alvo).
- `public/assets/`: imagens, nuvens e fonte.
