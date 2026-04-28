# Magic Link Frontend URL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer o link enviado por e-mail no Magic Link apontar para o frontend (`http://localhost:3333/auth/verify?token=...`) em vez da rota da API.

**Architecture:** Separar as variáveis de ambiente `APP_URL` (API) e `FRONTEND_URL` (frontend). O use-case `requestMagicLink` passa a usar `FRONTEND_URL` ao montar o link.

**Tech Stack:** TypeScript, Node.js, variáveis de ambiente via `process.env`

---

### Task 1: Atualizar `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Editar `.env.example`**

Substituir o bloco `APP_URL` atual por:

```
# URL base da API
APP_URL=http://localhost:3000

# URL do frontend (usada no link do magic link)
FRONTEND_URL=http://localhost:3333
```

- [ ] **Step 2: Verificar visualmente**

Abrir `.env.example` e confirmar que `FRONTEND_URL` está presente com o valor correto.

---

### Task 2: Atualizar o use-case `request-magic-link`

**Files:**
- Modify: `src/use-cases/request-magic-link/index.ts:27`

- [ ] **Step 1: Alterar a linha do link**

Trocar:
```typescript
const link = `${process.env.APP_URL}/api/auth/verify?token=${rawToken}`;
```

Por:
```typescript
const link = `${process.env.FRONTEND_URL}/auth/verify?token=${rawToken}`;
```

- [ ] **Step 2: Rodar os testes existentes para garantir que nada quebrou**

```bash
npx jest --runInBand
```

Esperado: todos os testes passam (a mudança não afeta lógica de negócio nem testes existentes).

- [ ] **Step 3: Verificação manual**

Disparar `POST /api/auth/request` com um e-mail cadastrado e confirmar que o link recebido no e-mail aponta para `http://localhost:3333/auth/verify?token=<hash>`.

- [ ] **Step 4: Commit**

```bash
git add .env.example src/use-cases/request-magic-link/index.ts
git commit -m "fix: magic link now points to frontend URL"
```
