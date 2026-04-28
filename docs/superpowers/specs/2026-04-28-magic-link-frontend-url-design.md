# Design — Corrigir fluxo do Magic Link

**Data:** 2026-04-28  
**Status:** aprovado

## Problema

O link enviado por e-mail no fluxo de Magic Link aponta para a rota da API:

```
http://localhost:3000/api/auth/verify?token=<hash>
```

O usuário clica e recebe um JSON com o JWT — sem interface. O correto é o link apontar para o frontend, que captura o `?token=` na URL e chama a API para trocar o token pelo JWT.

## Solução

Separar as variáveis de ambiente da API e do frontend:

| Variável | Valor (dev) | Uso |
|---|---|---|
| `APP_URL` | `http://localhost:3000` | URL base da API |
| `FRONTEND_URL` | `http://localhost:3333` | URL do frontend (link do magic link) |

O link gerado passa a ser:

```
http://localhost:3333/auth/verify?token=<hash>
```

## Arquivos alterados

### `.env.example`
- Atualizar comentário do `APP_URL` para deixar claro que é a URL da API
- Adicionar `FRONTEND_URL=http://localhost:3333`

### `src/use-cases/request-magic-link/index.ts`
- Linha 27: trocar `process.env.APP_URL` por `process.env.FRONTEND_URL`
- Trocar `/api/auth/verify` por `/auth/verify` (rota do frontend, sem prefixo `/api`)

## O que não muda

- Nenhuma rota da API
- Lógica de geração e validação de token
- `verify-magic-link` use-case

## Fora de escopo

A rota `/auth/verify` no frontend (`recipe-web`) ainda não existe — será implementada em sessão separada.

## Verificação

Checar manualmente que o link no e-mail aponta para `http://localhost:3333/auth/verify?token=...` após a mudança.
