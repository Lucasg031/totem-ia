# Totem IA — Deploy no Render (grátis, sem cartão)

Render hospeda o backend + frontend juntos, com HTTPS automático.

---

## 🚀 Deploy em 5 minutos

### 1. Preparar o repositório no GitHub

```bash
# Na sua máquina, na pasta do projeto:
git init
git add .
git commit -m "initial commit"
# Crie um repositório no github.com e:
git remote add origin https://github.com/seu-usuario/totem-ia.git
git push -u origin main
```

### 2. Criar conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em **"Get Started"** → cadastre com GitHub
3. **Não precisa de cartão de crédito** no plano gratuito

### 3. Criar o Web Service

1. No dashboard do Render, clique **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub
3. Configure:

| Campo | Valor |
|-------|-------|
| **Name** | `totem-ia` |
| **Runtime** | `Node` |
| **Build Command** | `cd frontend && npm ci && npm run build && cd ../backend && npm ci && npm run build` |
| **Start Command** | `node backend/dist/index.js` |
| **Plan** | `Free` |

4. Em **"Advanced"** → **"Add Environment Variable"**:

| Chave | Valor |
|-------|-------|
| `NODE_ENV` | `production` |
| `VITE_API_URL` | `https://totem-ia.onrender.com/api` |
| `OPENAI_API_KEY` | `sk-sua-chave-openai` |
| `DATABASE_URL` | *(deixe vazio)* |

5. Clique **"Create Web Service"**

### 4. Aguardar o build

O Render vai:
1. Instalar dependências do frontend
2. Buildar o frontend (`npm run build`)
3. Instalar dependências do backend
4. Compilar o backend (`tsc`)
5. Iniciar o servidor

Isso leva **2–5 minutos** na primeira vez.

### 5. Acessar

```
https://totem-ia.onrender.com
```

HTTPS automático ✅

---

## 🌐 Opcional: DuckDNS (domínio personalizado)

O Render já te dá `https://totem-ia.onrender.com` de graça com HTTPS.

Se quiser um domínio bonito tipo `meutotem.duckdns.org`:

1. Crie em [duckdns.org](https://duckdns.org) — domínio `meutotem`
2. No Render: **Settings → Custom Domain** → `meutotem.duckdns.org`
3. No DuckDNS: aponte o registro A para o IP do Render

---

## 📊 Comandos úteis

| Ação | Onde |
|------|------|
| Ver logs | Dashboard Render → **Logs** |
| Reiniciar | Dashboard → **Manual Deploy** → **Clear Build Cache & Deploy** |
| Variáveis | Dashboard → **Environment** |
| Deploy manual | Dashboard → **Manual Deploy** → **Deploy latest commit** |

---

## 🔄 Atualizar o app

```bash
git add .
git commit -m "descrição das mudanças"
git push
```

O Render detecta o push e faz deploy automático.

---

## 🔒 Segurança

- ✅ HTTPS automático (Render cuida disso)
- ✅ Backend + frontend no mesmo serviço
- ✅ CORS liberado (padrão)
- ✅ Dados persistentes via SQLite (no disco do Render)

---

## ⚠️ Limitações do plano Free

| Limitação | Detalhe |
|-----------|---------|
| Sleep | O serviço "dorme" após 15 min sem uso |
| Wake up | Primeira requisição demora ~30s |
| Bandwidth | 100 GB/mês |
| Build | 500 minutos/mês |

Para evitar o sleep, você pode acessar o site periodicamente ou usar um serviço de uptime monitoring (ex: [cron-job.org](https://cron-job.org), grátis).

---

## 🧪 Verificação

```bash
# Frontend
curl https://totem-ia.onrender.com

# API
curl https://totem-ia.onrender.com/api/health

# Deve retornar:
# {"status":"ok","timestamp":"..."}
```

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| Build falha | Ver logs no Dashboard → **Events** → **Build** |
| "Cannot find module" | O build command não executou corretamente |
| 502 Bad Gateway | O servidor pode estar "acordando" (aguarde 30s) |
| Página em branco | Verifique o `VITE_API_URL` nas env vars |
