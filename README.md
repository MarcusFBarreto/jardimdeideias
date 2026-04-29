# Jardim de Ideias

MVP em Next.js para uma rede social simples de ideias. A aplicação permite criar ideias, explorar um feed ordenado por score, buscar por texto, apoiar ideias e adicionar evoluções estruturadas.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Fluxo principal

- Criar ideia com título, descrição e problema.
- Ver ideias no feed, ordenadas por score decrescente.
- Alternar o feed entre `Em alta`, `Novas` e `Em evolução`.
- Buscar ideias por palavra-chave.
- Abrir uma ideia para ver detalhes e timeline.
- Apoiar uma ideia.
- Adicionar evoluções do tipo melhoria, crítica, variação ou aplicação, com impacto opcional.

## V2

- Score: `apoios + (2 x evoluções) + bônus recente`.
- Bônus recente: `2` pontos para ideias criadas nas últimas 48 horas.
- Estado automático da ideia: `Nova`, `Em evolução` ou `Madura`.
- Destaque de `Última evolução` no detalhe da ideia.

## Persistência

Os dados são salvos no `localStorage` do navegador. Não há backend, autenticação ou banco de dados nesta versão.
