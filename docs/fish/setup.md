# 🐟 Fish.audio — Setup como motor opcional de STT/TTS

Fish.audio é um motor **pago** de voz neural que pode ser usado como alternativa ao Web Speech API nativo do navegador. Resolve problemas de reconhecimento de voz em tablets Android e oferece vozes neurais de alta qualidade.

## Custos (referência 2026)
- **STT (Speech-to-Text)**: ~$0.36/hora de áudio
- **TTS (Text-to-Speech)**: ~$15 por milhão de UTF-8 bytes
- Plano Free: 8.000 créditos/mês (suficiente para testes)

## Quando usar
- ✅ Tablets Android onde o STT nativo do Chrome falha (problema conhecido — Chromium #23458)
- ✅ Quando você quer voz neural mais natural que a do navegador
- ❌ NÃO use se o robô atual funciona bem — STT nativo é grátis

## Arquitetura

```
[Microfone do tablet]
       ↓
[MediaRecorder API] ← captura áudio em audio/webm;codecs=opus
       ↓
[POST /api/webhook-audio] ← proxy local (multipart/form-data)
       ↓
[Webhook n8n] ← recebe audio + metadata + tipo
       ↓
[Switch: tipo==fish-stt ou fish-tts]
       ↓
[Fish Audio node] ← transcreve OU sintetiza
       ↓
[Respond to Webhook] ← retorna {text} ou {text, audio_url/audio_base64}
       ↓
[Browser] ← toca MP3 via <audio> OU processa texto
```

## Instalação no n8n

### 1. Instalar o node da comunidade
1. No n8n: **Settings** → **Community Nodes**
2. Clique em **Install**
3. Digite: `n8n-nodes-fishaudio`
4. Aceite os riscos e instale

### 2. Criar credencial Fish Audio
1. Crie conta em [fish.audio](https://fish.audio) e gere uma API key
2. No n8n: **Credentials** → **Add Credential**
3. Busque "Fish Audio API"
4. Cole a API key
5. Salve

### 3. Importar o workflow
Importe o arquivo `n8n-fish-workflow.json` no n8n:
1. **Workflows** → **Import from File**
2. Selecione `docs/n8n-fish-workflow.json`
3. Configure a credencial Fish Audio no node
4. **Ativar** o workflow
5. Copie a URL do webhook (será algo como `https://seu-n8n.com/webhook/fish-audio`)

### 4. Configurar no app
1. Abra o robô no navegador
2. Clique no ícone de engrenagem (Configurações)
3. Vá até a seção **"Webhook"** e cole a URL acima
4. Vá até a seção **"🐟 Fish.audio (opcional, pago)"**
5. Marque **"Usar Fish.audio para reconhecimento de voz (STT)"** se quiser STT pelo Fish
6. Marque **"Usar Fish.audio para síntese de voz neural (TTS)"** se quiser TTS pelo Fish
7. Clique em **Salvar**
8. **Recarregue a página** (F5) — necessário para a flag ser lida

## Como o workflow identifica o tipo de request

O frontend envia um campo `tipo` no FormData:
- `fish-stt` → o n8n chama o node Fish Audio **Speech to Text**
- `fish-tts` → o n8n chama o node Fish Audio **Text to Speech**

O node **Switch** no workflow roteia baseado nesse campo.

## Formato das respostas

### Fish STT (transcrição)
O workflow retorna JSON:
```json
{
  "text": "olá robô, qual é a capital da frança"
}
```

O frontend aceita campos alternativos: `text`, `transcript`, `texto`.

### Fish TTS (síntese)
O workflow retorna JSON:
```json
{
  "text": "A capital da França é Paris.",
  "audio_url": "https://..."
}
```

OU, se preferir retornar o MP3 inline:
```json
{
  "text": "A capital da França é Paris.",
  "audio_base64": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjQ1..."
}
```

O frontend prefere `audio_url` e cai para `audio_base64` se não houver.

## Fallback automático

Se o Fish falhar (API fora, timeout, key inválida), o frontend:
1. **STT**: cai automaticamente para Web Speech API nativo do navegador
2. **TTS**: cai automaticamente para `speechSynthesis.speak()` do navegador

O usuário **não percebe** a falha — só vê o robô funcionando com o motor padrão.

## Timeouts (configurados no frontend)
- **STT**: 8 segundos (após isso, fallback)
- **TTS**: 12 segundos (após isso, fallback)

## Limite de tamanho
- Áudio > 10MB → erro 413 com mensagem clara
- Duração máxima de gravação: 30s (hard cap no MediaRecorder)
- VAD (Voice Activity Detection) para automaticamente após 1.5s de silêncio

## Compatibilidade de navegadores

| Browser | STT Fish | TTS Fish | Observação |
|---|---|---|---|
| Chrome 120+ desktop | ✅ | ✅ | Recomendado |
| Chrome 120+ Android | ✅ | ✅ | Resolve bug STT nativo |
| Edge 120+ | ✅ | ✅ | Idem Chrome |
| Firefox 120+ | ✅ | ✅ | Usa audio/ogg |
| Safari 16+ | ⚠️ parcial | ✅ | MediaRecorder limitado |

Se o navegador não suporta MediaRecorder, o toggle STT fica **desabilitado** automaticamente (com aviso visual).

## Estrutura dos arquivos criados/modificados

```
app/
  api/
    webhook/
      route.js               (NÃO TOCADO)
    webhook-audio/
      route.js               (NOVO — proxy multipart)
    config/
      route.js               (+2 chaves: fishSttEnabled, fishTtsEnabled)
  ...
public/
  js/
    audio-capture.js         (NOVO — MediaRecorder + VAD)
    fish-capability.js       (NOVO — detecção de suporte)
    speech.js                (branch Fish em init/startListening/speak)
    config.js                (2 checkboxes novos)
    webhook.js               (NÃO TOCADO)
    app.js                   (1 linha: configureFish)
  robot.html                 (+2 scripts, +2 checkboxes, +1 section)
setup-db.js                  (2 colunas: fish_stt_enabled, fish_tts_enabled)
```

## Rollback de emergência

Se algo der errado e você precisar desligar Fish para todos os usuários:

```sql
-- Desligar Fish para todas as configs (rollback instantâneo)
UPDATE robot_configs SET fish_stt_enabled = 0, fish_tts_enabled = 0;
```

Ou delete a rota nova:
```bash
rm app/api/webhook-audio/route.js
```

O frontend vai detectar `__fishCapabilityOk = false` ou as flags `0` e usar Web Speech API normalmente.
