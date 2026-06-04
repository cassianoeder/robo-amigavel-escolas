/* ============================================
   WEBHOOK.JS — Comunicação com n8n
   ============================================ */

const Webhook = (() => {
    
    /**
     * Envia dados para o webhook n8n
     * @param {string} url - URL do webhook
     * @param {Object} body - Corpo da requisição
     * @param {string} [token] - JWT Bearer token (opcional)
     * @returns {Promise<string>} Texto da resposta
     */
    async function enviar(url, body, token = '') {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            // Usa o proxy local (Vercel Serverless Function) para evitar erros de CORS
            const response = await fetch('/api/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    targetUrl: url,
                    token: token,
                    payload: body
                })
            });

            if (!response.ok) {
                console.error(`Webhook respondeu com status ${response.status}`);
                return '';
            }

            // Try to parse JSON response
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const data = await response.json();
                // n8n can return in various formats
                // Common: { "resposta": "texto" } or { "output": "texto" } or { "message": "texto" } or plain string
                return data.resposta || data.output || data.message || data.texto || data.response || data.reply || 
                       (typeof data === 'string' ? data : JSON.stringify(data));
            }

            // Plain text response
            return await response.text();
        } catch (e) {
            console.error('Erro ao enviar para webhook:', e);
            return '';
        }
    }

    /**
     * Envia fala transcrita para o webhook
     */
    async function enviarFala(config, mensagem) {
        const body = {
            sessao_id: config.sessaoId,
            tipo: 'fala',
            mensagem: mensagem,
            modo: config.isKidsMode ? 'kids' : 'normal'
        };
        return enviar(config.webhookUrl, body, config.jwtToken);
    }

    /**
     * Envia evento de movimento detectado
     */
    async function enviarMovimento(config) {
        const body = {
            sessao_id: config.sessaoId,
            tipo: 'movimento detectado',
            modo: config.isKidsMode ? 'kids' : 'normal'
        };
        return enviar(config.webhookUrl, body, config.jwtToken);
    }

    return {
        enviarFala,
        enviarMovimento
    };
})();
