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
        const now = new Date();
        const body = {
            robot_name: config.robotName || 'Robô',
            sessao_id: config.sessaoId,
            tipo: 'fala',
            mensagem: mensagem,
            modo: config.isKidsMode ? 'kids' : 'normal',
            assunto: config.topicDia ? config.topicDia.trim() : '',
            // Teacher name
            nome_professor: config.nomeProfessor || '',
            // BNCC fields
            codigo_bncc: config.codigoBNCC || '',
            descricao_bncc: config.descricaoBNCC || '',
            // Pedagogical fields
            disciplina: config.disciplina || '',
            objetivo_aula: config.objetivoAula || '',
            turno: config.turno || '',
            proximos_eventos: config.proximosEventos || '',
            // Location fields
            pais: config.pais || '',
            estado: config.estado || '',
            cidade: config.cidade || '',
            nome_escola: config.nomeEscola || '',
            sala_local: config.salaLocal || '',
            // Administrative staff
            nome_diretor: config.nomeDiretor || '',
            nome_recepcionista: config.nomeRecepcionista || '',
            nome_secretario: config.nomeSecretario || '',
            // Automatic date/time
            hora: now.toLocaleTimeString('pt-BR'),
            dia: now.toLocaleDateString('pt-BR'),
            ano: now.getFullYear()
        };
        return enviar(config.webhookUrl, body, config.jwtToken);
    }

    /**
     * Envia evento de movimento detectado
     */
    async function enviarMovimento(config) {
        const now = new Date();
        const body = {
            robot_name: config.robotName || 'Robô',
            sessao_id: config.sessaoId,
            tipo: 'movimento detectado',
            modo: config.isKidsMode ? 'kids' : 'normal',
            assunto: config.topicDia ? config.topicDia.trim() : '',
            // Teacher name
            nome_professor: config.nomeProfessor || '',
            // BNCC fields
            codigo_bncc: config.codigoBNCC || '',
            descricao_bncc: config.descricaoBNCC || '',
            // Pedagogical fields
            disciplina: config.disciplina || '',
            objetivo_aula: config.objetivoAula || '',
            turno: config.turno || '',
            proximos_eventos: config.proximosEventos || '',
            // Location fields
            pais: config.pais || '',
            estado: config.estado || '',
            cidade: config.cidade || '',
            nome_escola: config.nomeEscola || '',
            sala_local: config.salaLocal || '',
            // Administrative staff
            nome_diretor: config.nomeDiretor || '',
            nome_recepcionista: config.nomeRecepcionista || '',
            nome_secretario: config.nomeSecretario || '',
            // Automatic date/time
            hora: now.toLocaleTimeString('pt-BR'),
            dia: now.toLocaleDateString('pt-BR'),
            ano: now.getFullYear()
        };
        return enviar(config.webhookUrl, body, config.jwtToken);
    }

    /**
     * Envia teste de webhook com dados de exemplo
     */
    async function enviarTeste(config) {
        const now = new Date();
        const body = {
            robot_name: config.robotName || 'Robô de Teste',
            sessao_id: config.sessaoId || 'teste-' + Date.now(),
            tipo: 'teste',
            mensagem: 'Esta é uma mensagem de teste do robô.',
            modo: config.isKidsMode ? 'kids' : 'normal',
            assunto: config.topicDia || 'Assunto de teste',
            // Teacher name
            nome_professor: config.nomeProfessor || 'Maria Silva',
            // BNCC fields
            codigo_bncc: config.codigoBNCC || 'EF05MA01',
            descricao_bncc: config.descricaoBNCC || 'Resolver e elaborar problemas de adição e subtração',
            // Pedagogical fields
            disciplina: config.disciplina || 'Matemática',
            objetivo_aula: config.objetivoAula || 'Compreender frações equivalentes',
            turno: config.turno || 'matutino',
            proximos_eventos: config.proximosEventos || 'Festa Junina - 15/06 - Gincana',
            // Location fields
            pais: config.pais || 'Brasil',
            estado: config.estado || 'São Paulo',
            cidade: config.cidade || 'São Paulo',
            nome_escola: config.nomeEscola || 'Escola de Teste',
            sala_local: config.salaLocal || 'Sala 101',
            // Administrative staff
            nome_diretor: config.nomeDiretor || 'Diretor Teste',
            nome_recepcionista: config.nomeRecepcionista || 'Recepcionista Teste',
            nome_secretario: config.nomeSecretario || 'Secretário Teste',
            // Automatic date/time
            hora: now.toLocaleTimeString('pt-BR'),
            dia: now.toLocaleDateString('pt-BR'),
            ano: now.getFullYear()
        };
        return enviar(config.webhookUrl, body, config.jwtToken);
    }

    return {
        enviarFala,
        enviarMovimento,
        enviarTeste
    };
})();
