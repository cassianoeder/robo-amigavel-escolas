# Documentação

Documentação do Robô Educacional.

## Estrutura

```
docs/
├── README.md               ← este arquivo
├── fish/                   ← Documentação do Fish.audio (motor opcional de STT/TTS)
│   ├── setup.md            ← Guia de instalação e uso
│   └── workflow.json       ← Workflow n8n importável
└── _artifacts/             ← Artefatos de teste (gitignored) — não commitar
    ├── README.md
    ├── baseline/           ← Outputs de build/lint/db do baseline
    ├── payloads/           ← JSONs de teste para curl
    ├── responses/          ← Respostas HTTP capturadas
    ├── served/             ← Arquivos baixados do servidor para verificação
    ├── cookies/            ← Cookies de sessão de teste
    └── binaries/           ← Áudios binários de teste
```

## O que cada pasta contém

### `docs/fish/` — Fish.audio
Documentação do motor opcional pago de voz neural. Veja `fish/setup.md`.

### `docs/_artifacts/` — Artefatos de teste
Arquivos gerados durante o desenvolvimento e validação. **Não são parte do produto** — são evidências das validações executadas. Pasta inteira é gitignored.

## Como usar

1. Para configurar o Fish.audio: leia `docs/fish/setup.md`
2. Para importar o workflow n8n: use `docs/fish/workflow.json`
3. Para reproduzir uma validação: olhe os payloads/responses em `_artifacts/`
