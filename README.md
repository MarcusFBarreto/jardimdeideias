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
- Buscar ideias por palavra-chave.
- Abrir uma ideia para ver detalhes e timeline.
- Apoiar uma ideia.
- Adicionar evoluções do tipo melhoria, crítica, variação ou aplicação.

## Persistência

Os dados são salvos no `localStorage` do navegador. Não há backend, autenticação ou banco de dados nesta versão.
