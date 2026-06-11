import Link from 'next/link';

// ---------- Helpers ----------

const ROBOT_THEMES = [
  { name: 'Azul Escuro', face: '#1B3A6B', iris: '#3B2F1E', pupil: '#0A1A30' },
  { name: 'Rosa',         face: '#FF69B4', iris: '#3B2F1E', pupil: '#CC3366' },
  { name: 'Verde Neon',   face: '#22CC10', iris: '#3B2F1E', pupil: '#1A8008' },
  { name: 'Laranja',      face: '#FF6B35', iris: '#3B2F1E', pupil: '#CC4415' },
  { name: 'Branco',       face: '#D8D8E8', iris: '#5A4F3E', pupil: '#666680' },
  { name: 'Preto',        face: '#1A1A1A', iris: '#5A5A5A', pupil: '#000000' },
];

function RobotFace({ face, iris, pupil, name }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="animate-robot-idle">
        <svg
          viewBox="0 0 320 220"
          className="w-full h-auto drop-shadow-xl"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`Rosto do robô na cor ${name}`}
        >
          <rect x="6" y="6" width="308" height="208" rx="36" ry="36" fill={face} />

          {/* Cheeks */}
          <ellipse cx="80"  cy="148" rx="16" ry="7" fill="rgba(255, 105, 180, 0.45)" />
          <ellipse cx="240" cy="148" rx="16" ry="7" fill="rgba(255, 105, 180, 0.45)" />

          {/* Left eye */}
          <g className="animate-robot-blink">
            <ellipse cx="108" cy="92" rx="40" ry="44" fill="#FFFFFF" />
            <circle  cx="108" cy="92" r="22" fill={iris} />
            <circle  cx="108" cy="92" r="11" fill={pupil} />
            <ellipse cx="100" cy="84" rx="6" ry="8" fill="rgba(255,255,255,0.85)" />
          </g>

          {/* Right eye */}
          <g className="animate-robot-blink">
            <ellipse cx="212" cy="92" rx="40" ry="44" fill="#FFFFFF" />
            <circle  cx="212" cy="92" r="22" fill={iris} />
            <circle  cx="212" cy="92" r="11" fill={pupil} />
            <ellipse cx="204" cy="84" rx="6" ry="8" fill="rgba(255,255,255,0.85)" />
          </g>

          {/* Mouth */}
          <path
            d="M 120 170 Q 160 195 200 170"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-sm text-white/60 font-medium">{name}</span>
    </div>
  );
}

const PERSONAS = [
  {
    icon: '📚',
    title: 'Professores',
    desc: 'Use o robô em demonstrações, projetos integradores, feiras de ciências e mostras tecnológicas. Defina o "Assunto do Dia" e tenha um apoio interativo na sala.',
  },
  {
    icon: '👔',
    title: 'Diretores',
    desc: 'Posicione a escola como inovadora. Um diferencial visível na recepção, em portas abertas e eventos com a comunidade.',
  },
  {
    icon: '💻',
    title: 'Coordenadores de TI',
    desc: 'Frontend testado e pronto. Conecte um webhook do n8n, exponha os dados que quiser e mantenha o controle total da camada de backend.',
  },
  {
    icon: '🏛️',
    title: 'Mantenedores',
    desc: 'Vitrine tecnológica de baixo custo e alta percepção. O frontend é gratuito — você paga apenas pela infraestrutura do n8n.',
  },
];

const USE_CASES = [
  {
    icon: '📋',
    title: 'Recepção inteligente',
    desc: 'Responde pais e visitantes sobre horários, salas, calendário, contatos da equipe e protocolos da escola — em voz natural.',
  },
  {
    icon: '📢',
    title: 'Comunicação interna',
    desc: 'Divulga próximos eventos, reuniões, mudanças no calendário e avisos importantes para quem passa pelo corredor.',
  },
  {
    icon: '🏆',
    title: 'Vitrine de inovação',
    desc: 'Apresenta a escola em portas abertas, eventos e visitas de famílias. Demonstração concreta de que a instituição investe em tecnologia.',
  },
  {
    icon: '🎤',
    title: 'Apoio em eventos',
    desc: 'Dá boas-vindas, anuncia atividades, informa programação e ajuda na orientação durante feiras, formaturas e gincanas.',
  },
  {
    icon: '🔌',
    title: 'Integra com seus sistemas',
    desc: 'Plug com sistema acadêmico, planilhas, calendário Google, ERP escolar ou qualquer API via n8n. Os dados continuam na escola.',
  },
  {
    icon: '🌍',
    title: 'Multilíngue (configurável)',
    desc: 'Recebe famílias de outros países e intercambistas com a voz e o idioma que a escola configurar no backend.',
  },
];

const FLOW_STEPS = [
  {
    icon: '🎙️',
    title: 'Alguém fala',
    desc: 'O microfone escuta a pergunta na recepção, sala ou evento.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: '📝',
    title: 'Texto reconhecido',
    desc: 'A fala vira texto direto no navegador (STT).',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: '{ }',
    title: 'JSON ao backend',
    desc: 'O texto é empacotado e enviado ao webhook do n8n da escola.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: '🧠',
    title: 'Backend processa',
    desc: 'O n8n combina IA + dados da escola e monta a resposta certa.',
    color: 'from-violet-500 to-violet-600',
  },
  {
    icon: '🔊',
    title: 'Robô responde',
    desc: 'A resposta retorna em JSON e o robô fala em voz natural (TTS).',
    color: 'from-pink-500 to-pink-600',
  },
];

const COMPARISON_ROWS = [
  {
    feature: 'Conhece sua escola',
    competitor: 'Não — responde de forma genérica',
    ours: 'Sim — sabe horários, eventos, equipe, calendário',
  },
  {
    feature: 'Integração com seus sistemas',
    competitor: 'Limitada ao ecossistema do fabricante',
    ours: 'Total — sistema acadêmico, planilhas, APIs via n8n',
  },
  {
    feature: 'Personalização visual',
    competitor: 'Praticamente nenhuma',
    ours: 'Cor, voz, nome, boné com a logo da escola',
  },
  {
    feature: 'Onde roda',
    competitor: 'Dispositivo proprietário',
    ours: 'Qualquer tela com Chrome ou Edge',
  },
  {
    feature: 'Quem controla os dados',
    competitor: 'A Big Tech',
    ours: 'A escola — os dados ficam no seu backend',
  },
  {
    feature: 'Lógica de resposta',
    competitor: 'Caixa-preta',
    ours: 'Visual e auditável no n8n',
  },
];

// ---------- Page ----------

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white font-['Outfit']">
      {/* ===== Header ===== */}
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
          <span className="font-bold text-xl tracking-wide">Robô Programado por Jovens</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
            Entrar
          </Link>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <main className="flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-4">
            🚀 Projeto de Extraclasse de Programação
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Robô <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">inteligente</span> com cérebro programado por adolescentes
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Projeto desenvolvido por jovens em curso de programação. Eles criaram a lógica do robô usando n8n - o cérebro que controla todas as funções e respostas do sistema.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login" className="px-8 py-4 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full transition-all shadow-xl hover:scale-105">
              Acessar Projeto
            </Link>
          </div>

          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-200 text-sm max-w-lg mx-auto flex items-center justify-center gap-3">
            <span className="text-xl">🎓</span>
            <p className="text-left">
              <strong>Educação:</strong> Projeto prático de programação para ensinar lógica, automação e integração de sistemas.
            </p>
          </div>
        </div>
      </main>

      {/* ===== Sobre o Projeto ===== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Um projeto educacional
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            Jovens aprendendo programação na prática através da criação de um robô inteligente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">👨‍💻</div>
              <h3 className="text-lg font-semibold mb-2">Aprendizado Prático</h3>
              <p className="text-white/50 text-sm leading-relaxed">Jovens desenvolvem habilidades reais de programação, automação e integração de sistemas.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold mb-2">Lógica com n8n</h3>
              <p className="text-white/50 text-sm leading-relaxed">Os jovens programam o cérebro do robô usando n8n, criando a lógica que controla todas as funcionalidades.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Projeto Real</h3>
              <p className="text-white/50 text-sm leading-relaxed">Desenvolvem um projeto completo do zero, do design à implementação funcional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Como os jovens programam ===== */}
      <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Como o robô foi programado
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            O frontend já está pronto. Os jovens focam em programar a lógica do robô usando n8n - o cérebro do sistema.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">🎙️</div>
              <h3 className="text-lg font-semibold mb-2">Reconhecimento de Voz</h3>
              <p className="text-white/50 text-sm leading-relaxed">Integraram APIs de reconhecimento de voz para entender comandos dos usuários.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-lg font-semibold mb-2">Lógica de Resposta</h3>
              <p className="text-white/50 text-sm leading-relaxed">Programam o cérebro do robô no n8n, criando a inteligência que gera respostas contextualizadas.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">🔊</div>
              <h3 className="text-lg font-semibold mb-2">Síntese de Voz</h3>
              <p className="text-white/50 text-sm leading-relaxed">Programaram a resposta do robô em voz natural através de TTS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Tecnologias Aprendidas ===== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Tecnologias dominadas
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            Durante o projeto, os jovens aprenderam e aplicaram diversas tecnologias.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '⚡', title: 'n8n', desc: 'Programação do cérebro do robô' },
              { icon: '🌐', title: 'Next.js', desc: 'Frontend pré-desenvolvido' },
              { icon: '🎨', title: 'CSS/Animations', desc: 'Design e expressões visuais' },
              { icon: '🔗', title: 'Integração n8n', desc: 'Conexão frontend-backend' },
              { icon: '🎙️', title: 'STT/TTS', desc: 'Reconhecimento e síntese de voz' },
              { icon: '📱', title: 'Design Responsivo', desc: 'Adaptação para diferentes telas' },
            ].map((tech, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <span className="text-lg">{tech.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm text-white/80">{tech.title}</h3>
                  <p className="text-xs text-white/50">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Resultados do Aprendizado ===== */}
      <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            O que foi aprendido
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            Durante o projeto, os jovens desenvolveram competências técnicas e sociais importantes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">🎯 Competências Técnicas</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Programação do cérebro do robô com n8n</li>
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Integração frontend-backend</li>
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Automação de fluxos de trabalho</li>
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Lógica de respostas programada</li>
                <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Versionamento de código</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">🤝 Competências Sociais</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Trabalho em equipe</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Comunicação técnica</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Resolução de problemas</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Pensamento crítico</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Criatividade</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Próximos Passos ===== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Continuando o aprendizado</h2>
          <p className="text-white/50 mb-10">O projeto continua evoluindo com novos desafios e funcionalidades.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { icon: '🚀', text: 'Adicionar novas integrações' },
              { icon: '🎯', text: 'Implementar aprendizado de máquina' },
              { icon: '📱', text: 'Criar aplicativo móvel' },
              { icon: '🌐', text: 'Expandir para outros idiomas' },
              { icon: '🎮', text: 'Desenvolver jogos educativos' },
              { icon: '📊', text: 'Criar dashboard analítico' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-white/70">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Final ===== */}
      <section className="px-6 py-20 border-t border-white/5 bg-gradient-to-b from-transparent to-[#1B3A6B]/10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Junte-se ao projeto
          </h2>
          <p className="text-white/50 text-lg">
            Acesse o frontend pronto e comece a programar a lógica do robô com n8n.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
            <Link href="/login" className="inline-block px-8 py-4 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full transition-all shadow-xl hover:scale-105">
              Acessar Projeto
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="p-6 text-center text-white/40 text-sm border-t border-white/10 space-y-2">
        <p>Robô Programado por Jovens - Projeto de Extraclasse de Programação</p>
        <p className="text-white/30 text-xs">
          Desenvolvido com ❤️ por jovens aprendizes de programação
        </p>
      </footer>
    </div>
  );
}
