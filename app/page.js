import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white font-['Outfit']">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#0a0a12]/80">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#brand-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <defs>
              <linearGradient id="brand-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60a5fa"/>
                <stop offset="100%" stopColor="#34d399"/>
              </linearGradient>
            </defs>
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
          <span className="font-bold text-xl tracking-wide">Assistente de Voz</span>
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
            🎓 100% gratuito · para alunos e usuários
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Construa seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">assistente de IA</span> com n8n, de graça
          </h1>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Um projeto prático e gratuito para alunos, professores e curiosos aprenderem sobre webhooks, JSON, n8n e inteligência artificial, criando um assistente de voz que funciona direto no navegador.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="px-8 py-4 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full transition-all shadow-xl hover:scale-105">
              Criar Meu Assistente Grátis
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
            Você só precisa de um navegador Chrome e um n8n. Escolha uma das opções gratuitas abaixo.
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
                title: 'Tenha um n8n rodando',
                desc: 'Use o n8n Cloud (14 dias grátis), faça self-hosted na sua máquina, ou use o n8n pré-configurado disponível para alunos do Academy.',
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

      {/* Opções de n8n */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Escolha como rodar o seu n8n
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            O robô é 100% gratuito. Você só precisa de um n8n rodando em qualquer uma das opções abaixo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Opção 1 — n8n Cloud */}
            <a
              href="https://n8n.io/cloud/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-400/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="text-3xl mb-4">☁️</div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                n8n Cloud
                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-medium">14 dias grátis</span>
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Crie sua conta no n8n Cloud e ganhe 14 dias gratuitos para testar. Sem cartão de crédito para começar. É a forma mais rápida de colocar seu robô no ar.
              </p>
              <span className="text-blue-300 text-sm font-medium group-hover:underline">
                Criar conta no n8n Cloud →
              </span>
            </a>

            {/* Opção 2 — Self-hosted */}
            <div className="bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl mb-4">🖥️</div>
              <h3 className="text-lg font-semibold mb-2">Self-hosted</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Rode o n8n na sua própria máquina ou servidor com Docker. Total controle, sem limites de tempo. Ideal para quem quer aprender de verdade como a infra funciona.
              </p>
            </div>

            {/* Opção 3 — Academy */}
            <a
              href="https://academy.edersonwermeier.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/20 hover:border-violet-400/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10"
            >
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                Alunos do Academy
                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-medium">de graça</span>
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Alunos do <strong className="text-white/70">academy.edersonwermeier.com</strong> têm n8n disponibilizado gratuitamente e pré-configurado. Basta acessar e usar.
              </p>
              <span className="text-violet-300 text-sm font-medium group-hover:underline">
                Acessar Academy →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">O que você precisa para começar</h2>
          <p className="text-white/50 mb-10">Sem complicação. Tudo gratuito.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { icon: '✅', text: 'Google Chrome ou Microsoft Edge' },
              { icon: '✅', text: 'Um n8n rodando (Cloud, self-hosted ou Academy)' },
              { icon: '✅', text: 'Domínio ou IP público acessível' },
              { icon: '✅', text: 'Um webhook configurado no n8n' },
              { icon: '🆓', text: 'O robô é 100% gratuito' },
              { icon: '🔒', text: 'Cada aluno/usuário tem sua conta isolada' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-white/70">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precisa de ajuda? */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1B3A6B]/20 to-emerald-500/10 border border-white/10 rounded-3xl p-8 md:p-12 text-center space-y-6">
            <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm font-medium">
              💬 Precisa de ajuda com n8n?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Configuramos tudo para você
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              O robô é gratuito. Mas se você precisa de uma mão para colocar o n8n de pé: seja na sua máquina, em um servidor da escola, ou para um projeto na empresa. Nós configuramos tudo. <strong className="text-white/80">Hospedagem de n8n</strong> para qualquer cenário: educação, pesquisa, negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <a
                href="https://wa.me/555599435002?text=Ol%C3%A1!%20Preciso%20de%20ajuda%20com%20n8n%20para%20o%20Meu%20Rob%C3%B4%20Personalizado"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-emerald-500 hover:bg-emerald-400 text-white rounded-full transition-all shadow-xl shadow-emerald-500/20 hover:scale-105"
              >
                <span>📱</span>
                Falar no WhatsApp
              </a>
              <span className="text-white/40 text-sm">(55) 99943-5002</span>
            </div>
            <p className="text-white/40 text-xs pt-2">
              Escolas, empresas e projetos pessoais. Atendemos todos os cenários.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 py-20 border-t border-white/5 bg-gradient-to-b from-transparent to-[#1B3A6B]/10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para colocar seu robô no ar?
          </h2>
          <p className="text-white/50 text-lg">
            Crie sua conta gratuita, escolha uma opção de n8n e comece agora. Sem experiência prévia necessária.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
            <Link href="/register" className="inline-block px-8 py-4 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full transition-all shadow-xl hover:scale-105">
              Criar Minha Conta Grátis
            </Link>
            <a
              href="https://wa.me/555599435002"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium border border-white/20 hover:border-white/40 rounded-full transition-all"
            >
              <span>💬</span>
              Falar com a gente
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center text-white/40 text-sm border-t border-white/10 space-y-2">
        <p>Assistente de Voz. Projeto educacional por Ederson Wermeier 🧡</p>
        <p className="text-white/30 text-xs">
          Dúvidas ou suporte? <a href="https://wa.me/555599435002" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">WhatsApp (55) 99943-5002</a>
        </p>
      </footer>
    </div>
  );
}
