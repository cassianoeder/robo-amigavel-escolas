import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidade — Meu Robô Personalizado',
  description: 'Política de privacidade e tratamento de dados pessoais conforme a LGPD.',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white font-['Outfit']">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#0a0a12]/80">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🤖</span>
          <span className="font-bold text-xl tracking-wide">Meu Robô Personalizado</span>
        </Link>
        <Link href="/" className="px-5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
          ← Voltar
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-white/40 text-sm mb-12">
          Última atualização: {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-10 text-white/70 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introdução</h2>
            <p>
              A plataforma <strong className="text-white/90">Meu Robô Personalizado</strong> é um projeto educacional 
              gratuito criado para ensinar adolescentes sobre inteligência artificial, automação, webhooks, 
              JSON e lógica de programação. Esta política descreve como tratamos os dados pessoais coletados, 
              em conformidade com a <strong className="text-white/90">Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Dados Coletados</h2>
            <p className="mb-3">Coletamos apenas os dados estritamente necessários para o funcionamento da plataforma:</p>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-3">
              <div className="flex gap-3">
                <span>📧</span>
                <div>
                  <strong className="text-white/90">E-mail:</strong> utilizado exclusivamente para login e identificação da conta.
                </div>
              </div>
              <div className="flex gap-3">
                <span>🔑</span>
                <div>
                  <strong className="text-white/90">Senha:</strong> armazenada de forma criptografada (hash bcrypt). 
                  Não temos acesso à sua senha em texto plano.
                </div>
              </div>
              <div className="flex gap-3">
                <span>⚙️</span>
                <div>
                  <strong className="text-white/90">Configurações do robô:</strong> nome, cor, voz, webhook, escola, 
                  localização e demais preferências que o próprio usuário preenche voluntariamente.
                </div>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Finalidade do Tratamento</h2>
            <p>Os dados são tratados com as seguintes finalidades:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
              <li>Permitir a criação e autenticação de contas de usuário;</li>
              <li>Salvar e restaurar as configurações personalizadas do robô;</li>
              <li>Enviar dados contextuais (nome, escola, assunto) ao webhook configurado pelo próprio usuário;</li>
              <li>Garantir a segurança e isolamento dos dados entre usuários diferentes.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Base Legal (Art. 7º, LGPD)</h2>
            <p>
              O tratamento dos dados é realizado com base no <strong className="text-white/90">consentimento do titular</strong> (Art. 7º, I) 
              fornecido no momento do cadastro, e na <strong className="text-white/90">execução de contrato</strong> (Art. 7º, V) — 
              ou seja, para a prestação do serviço solicitado pelo próprio usuário.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies Utilizados</h2>
            <p className="mb-3">Utilizamos apenas cookies essenciais:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">Cookie</th>
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">Tipo</th>
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">Finalidade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-mono text-xs text-blue-300">auth-token</td>
                    <td className="py-3 px-4">Essencial</td>
                    <td className="py-3 px-4">Manter a sessão de login do usuário (JWT HttpOnly)</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4 font-mono text-xs text-blue-300">cookie-consent</td>
                    <td className="py-3 px-4">Essencial</td>
                    <td className="py-3 px-4">Registrar a escolha do usuário sobre cookies (localStorage)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm">
              <strong className="text-white/90">Não utilizamos</strong> cookies de rastreamento, publicidade, analytics 
              ou quaisquer cookies de terceiros.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Compartilhamento de Dados</h2>
            <p>
              Os dados de configuração do robô são enviados ao <strong className="text-white/90">webhook configurado pelo próprio usuário</strong> (ex: n8n). 
              A plataforma não compartilha, vende ou transfere dados pessoais a terceiros. 
              O banco de dados (Turso/LibSQL) é utilizado exclusivamente para armazenar as informações 
              da conta e configurações do robô.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Segurança dos Dados</h2>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Senhas criptografadas com <strong className="text-white/90">bcrypt</strong> (10 rounds de salt);</li>
              <li>Sessões gerenciadas por <strong className="text-white/90">JWT em cookies HttpOnly</strong>, inacessíveis por JavaScript;</li>
              <li>Isolamento completo entre contas — um usuário não pode acessar dados de outro;</li>
              <li>Comunicação via HTTPS em ambiente de produção.</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Direitos do Titular (Art. 18, LGPD)</h2>
            <p className="mb-3">Você tem o direito de:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Confirmar a existência de tratamento dos seus dados;</li>
              <li>Acessar, corrigir ou atualizar seus dados pessoais;</li>
              <li>Solicitar a exclusão dos seus dados e da sua conta;</li>
              <li>Revogar o consentimento a qualquer momento;</li>
              <li>Obter informações sobre o compartilhamento dos seus dados.</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer desses direitos, entre em contato pelo e-mail indicado na seção abaixo.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Retenção de Dados</h2>
            <p>
              Os dados são mantidos enquanto a conta do usuário estiver ativa. 
              Caso o usuário solicite a exclusão da conta, todos os dados pessoais e 
              configurações serão removidos permanentemente do banco de dados.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Menores de Idade</h2>
            <p>
              Esta plataforma é voltada para fins educacionais e pode ser utilizada por menores de idade 
              sob supervisão de professores, pais ou responsáveis legais, conforme o Art. 14 da LGPD. 
              Não coletamos dados sensíveis de menores além do e-mail para cadastro.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contato do Controlador</h2>
            <p>
              Para dúvidas, solicitações ou exercício dos seus direitos como titular de dados, 
              entre em contato com o responsável pela plataforma:
            </p>
            <div className="mt-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
              <p><strong className="text-white/90">Responsável:</strong> Ederson Wermeier</p>
              <p className="mt-1"><strong className="text-white/90">Projeto:</strong> Meu Robô Personalizado</p>
            </div>
          </section>

        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
            ← Voltar para a página inicial
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-white/40 text-sm border-t border-white/10">
        Meu Robô Personalizado — Projeto educacional por Ederson Wermeier 🧡
      </footer>
    </div>
  );
}
