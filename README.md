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

## Onde editar

- `src/config.js`: nome, cargo, número de WhatsApp e Instagram (o site inteiro usa esses dados).
- `src/components/`: seções da página e o pop-up de diagnóstico (`LeadPopup.jsx`).
- `src/three/`: cenas 3D (gráfico, funil e alvo).
- `public/assets/`: imagens, nuvens e fonte.
