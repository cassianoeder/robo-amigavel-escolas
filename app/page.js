import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white font-['Outfit']">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#0a0a12]/80">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="font-bold text-xl tracking-wide">Meu Robô Personalizado</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
            Entrar
          </Link>
          <Link href="/register" className="px-5 py-2 text-sm font-medium bg-[#1B3A6B] hover:bg-[#254d8c] rounded-full transition-colors shadow-lg shadow-[#1B3A6B]/20">
            Criar Conta
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium mb-4">
            🎓 100% gratuito e educacional
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Aprenda <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">IA, automação e programação</span> construindo seu próprio robô
          </h1>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Um projeto prático e gratuito para adolescentes aprenderem sobre webhooks, JSON, domínios, lógica de programação, n8n e inteligência artificial — criando um assistente de voz que funciona no navegador.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="px-8 py-4 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full transition-all shadow-xl hover:scale-105">
              Criar Meu Robô Grátis
            </Link>
            <a href="#como-funciona" className="px-8 py-4 text-lg font-medium border border-white/20 hover:border-white/40 rounded-full transition-all">
              Como funciona?
            </a>
          </div>

          <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-200 text-sm max-w-lg mx-auto flex items-center justify-center gap-3">
            <span className="text-xl">🦊</span>
            <p className="text-left">
              <strong>Atenção:</strong> Para a experiência completa de voz (TTS/STT), use o <strong>Google Chrome</strong> ou <strong>Microsoft Edge</strong>.
            </p>
          </div>
        </div>
      </main>

      {/* O que você vai aprender */}
      <section id="como-funciona" className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            O que você vai aprender na prática
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            Cada aluno cria seu próprio robô e, no processo, aprende conceitos reais usados por desenvolvedores profissionais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔗',
                title: 'Webhooks & APIs',
                desc: 'Entenda como sistemas se comunicam pela internet. Configure seu próprio endpoint no n8n e veja dados fluírem em tempo real.'
              },
              {
                icon: '🧠',
                title: 'Inteligência Artificial',
                desc: 'Conecte seu robô a modelos de IA como ChatGPT ou Gemini via n8n. Aprenda o que é prompt, contexto e processamento de linguagem natural.'
              },
              {
                icon: '{ }',
                title: 'JSON & Estrutura de Dados',
                desc: 'Veja na prática como dados são trocados entre aplicações. Cada fala do robô vira um JSON com nome, escola, assunto e mais.'
              },
              {
                icon: '⚡',
                title: 'n8n & Automação',
                desc: 'Monte fluxos visuais no n8n que recebem a fala, processam com IA e devolvem a resposta. Automação de verdade, sem código.'
              },
              {
                icon: '🌐',
                title: 'Domínios & Infraestrutura',
                desc: 'Aprenda o que é domínio, IP público, HTTPS e como expor uma aplicação na internet. Conceitos essenciais para qualquer dev.'
              },
              {
                icon: '💡',
                title: 'Lógica de Programação',
                desc: 'Entenda condições, variáveis, fluxos e integrações. O robô é o resultado visual e divertido da lógica que você monta.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como começar */}
      <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Como começar em 3 passos
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-xl mx-auto">
            Você só precisa de um navegador Chrome e um n8n com domínio ou IP público.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Crie sua conta',
                desc: 'Cadastro rápido com e-mail e senha. Sem cartão, sem pegadinha. É gratuito.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                step: '02',
                title: 'Configure seu n8n',
                desc: 'Monte seu fluxo no n8n (self-hosted ou cloud) com um webhook de entrada e uma conexão com IA.',
                color: 'from-emerald-500 to-emerald-600'
              },
              {
                step: '03',
                title: 'Cole o webhook e ative',
                desc: 'Volte aqui, cole a URL do webhook, personalize cor, voz e nome. Seu robô estará falando em segundos.',
                color: 'from-violet-500 to-violet-600'
              }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} items-center justify-center text-xl font-bold shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">O que o aluno precisa?</h2>
          <p className="text-white/50 mb-10">O robô é disponibilizado gratuitamente. O aluno só precisa cuidar do n8n.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { icon: '✅', text: 'Google Chrome ou Microsoft Edge' },
              { icon: '✅', text: 'n8n funcionando (self-hosted ou cloud)' },
              { icon: '✅', text: 'Domínio ou IP público acessível' },
              { icon: '✅', text: 'Um webhook configurado no n8n' },
              { icon: '🆓', text: 'O robô é 100% gratuito' },
              { icon: '🔒', text: 'Cada aluno tem sua conta isolada' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-white/70">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 py-20 border-t border-white/5 bg-gradient-to-b from-transparent to-[#1B3A6B]/10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para construir seu robô?
          </h2>
          <p className="text-white/50 text-lg">
            Qualquer adolescente pode fazer. Sem experiência prévia. Comece agora e aprenda programação, IA e automação de forma prática.
          </p>
          <Link href="/register" className="inline-block px-8 py-4 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full transition-all shadow-xl hover:scale-105 mt-4">
            Criar Minha Conta Grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center text-white/40 text-sm border-t border-white/10">
        Meu Robô Personalizado — Projeto educacional por Ederson Wermeier 🧡
      </footer>
    </div>
  );
}
