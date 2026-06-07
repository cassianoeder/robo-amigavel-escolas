import Link from 'next/link';

// ---------- Helpers ----------

const ROBOT_THEMES = [
  { name: 'Azul Escuro', face: '#1B3A6B', iris: '#3B2F1E', pupil: '#0A1A30' },
  { name: 'Rosa',         face: '#FF69B4', iris: '#3B2F1E', pupil: '#CC3366' },
  { name: 'Verde Neon',   face: '#22CC10', iris: '#3B2F1E', pupil: '#1A8008' },
  { name: 'Laranja',      face: '#FF6B35', iris: '#3B2F1E', pupil: '#CC4415' },
  { name: 'Branco',       face: '#D8D8E8', iris: '#5A4F3E', pupil: '#666680' },
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

      {/* ===== Hero ===== */}
      <main className="flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium mb-4">
            🎓 Para escolas que querem inovar
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            O robô <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">assistente</span> da sua escola. Pronto e configurável.
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Frontend completo, com voz, personalização visual e expressões reativas. A escola só precisa ligar o backend no n8n com seus dados. Se não tem time de TI — <strong className="text-white/80">a gente configura para você</strong>.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="px-8 py-4 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full transition-all shadow-xl hover:scale-105">
              Criar Conta Gratuita
            </Link>
            <a
              href="https://wa.me/555599435002?text=Ol%C3%A1!%20Sou%20de%20uma%20escola%20e%20quero%20saber%20mais%20sobre%20o%20rob%C3%B4%20assistente"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 text-lg font-medium border border-white/20 hover:border-white/40 rounded-full transition-all"
            >
              Falar com a gente
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

      {/* ===== Para quem é ===== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Para quem é o robô
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            Pensado para a escola toda — do pedagógico ao administrativo, da TI à mantenedora.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERSONAS.map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Como sua escola usa ===== */}
      <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Como sua escola pode usar
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            Casos de uso reais que a sua instituição pode colocar no ar em pouco tempo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {USE_CASES.map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Como funciona — Animação ===== */}
      <section id="como-funciona" className="px-6 py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Como o robô funciona
          </h2>
          <p className="text-center text-white/50 mb-16 max-w-2xl mx-auto">
            Em segundos: da fala de quem está na frente do robô até a resposta com base nos dados da sua escola.
          </p>

          {/* Pipeline com animação */}
          <div className="relative">
            {/* Linha conectora (desktop) */}
            <div className="hidden md:block absolute top-[78px] left-[8%] right-[8%] h-[3px] bg-gradient-to-r from-blue-500/30 via-emerald-500/40 to-pink-500/30 rounded-full" />

            {/* Pacote animado (desktop) */}
            <div className="hidden md:block absolute top-[64px] left-[8%] right-[8%] h-0 pointer-events-none">
              <div className="relative h-0" style={{ width: '100%' }}>
                <div
                  className="absolute animate-flow-packet"
                  style={{ left: '0%', transform: 'translateX(-50%)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-[10px] font-mono font-bold text-black shadow-[0_0_24px_8px_rgba(96,165,250,0.55)]">
                    {'{}'}
                  </div>
                </div>
              </div>
            </div>

            {/* Cards dos 5 passos */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
              {FLOW_STEPS.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div
                    className="relative w-16 h-16 rounded-2xl bg-[#0a0a12] border border-white/[0.08] flex items-center justify-center text-2xl mb-4 z-10"
                    style={{ animation: `step-active 6s ease-in-out infinite ${i * 1.2}s` }}
                  >
                    <span aria-hidden="true">{step.icon}</span>
                    <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${step.color} text-[11px] font-bold flex items-center justify-center shadow-lg`}>
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed px-1">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detalhes técnicos abaixo do fluxo */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
              <div className="flex gap-1 h-8 items-end">
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-soundwave" style={{ animationDelay: '0s' }} />
                <span className="w-1 h-5 bg-emerald-400 rounded-full animate-soundwave" style={{ animationDelay: '0.15s' }} />
                <span className="w-1 h-7 bg-emerald-400 rounded-full animate-soundwave" style={{ animationDelay: '0.3s' }} />
                <span className="w-1 h-4 bg-emerald-400 rounded-full animate-soundwave" style={{ animationDelay: '0.45s' }} />
                <span className="w-1 h-6 bg-emerald-400 rounded-full animate-soundwave" style={{ animationDelay: '0.6s' }} />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Entrada</p>
                <p className="text-sm font-medium">Voz humana</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-mono text-emerald-300 text-sm">
                { '{ }' }
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Transporte</p>
                <p className="text-sm font-medium">JSON via Webhook</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-400/40 animate-spin-slow" />
                <span className="text-xl">🧠</span>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Inteligência</p>
                <p className="text-sm font-medium">IA + Dados da escola</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== O rosto do robô ===== */}
      <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Conheça o rosto do robô
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            Cinco cores prontas, expressões reativas (alegre, pensando, surpreso, sonolento) e boné customizável com a <strong className="text-white/70">logo da sua escola</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 max-w-5xl mx-auto">
            {ROBOT_THEMES.map((theme) => (
              <RobotFace
                key={theme.name}
                face={theme.face}
                iris={theme.iris}
                pupil={theme.pupil}
                name={theme.name}
              />
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">😊</div>
              <h3 className="font-semibold text-sm mb-1">Expressões reativas</h3>
              <p className="text-xs text-white/50">Pisca, olha em volta, sorri ao falar e dorme quando ninguém interage.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">🧢</div>
              <h3 className="font-semibold text-sm mb-1">Boné com a sua logo</h3>
              <p className="text-xs text-white/50">Suba o logo da escola em PNG ou SVG. A identidade visual fica completa.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">🔊</div>
              <h3 className="font-semibold text-sm mb-1">Voz configurável</h3>
              <p className="text-xs text-white/50">Escolha entre as vozes nativas do navegador. Ajuste velocidade e volume.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Comparação Alexa / Google ===== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-4">
              ⚡ A diferença na prática
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que não é &quot;só mais uma Alexa&quot;?
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              A Alexa e o Google Assistente não sabem o horário do recreio, o nome do diretor ou o calendário da feira de ciências. O nosso robô sabe — porque a sua escola ensinou.
            </p>
          </div>

          {/* Tabela (desktop) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.04] border-b border-white/10">
                  <th className="p-4 text-sm font-semibold text-white/70">Recurso</th>
                  <th className="p-4 text-sm font-semibold text-white/50">Alexa / Google Assistente</th>
                  <th className="p-4 text-sm font-semibold text-emerald-300">Nosso robô</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm font-medium text-white/80">{row.feature}</td>
                    <td className="p-4 text-sm text-white/50">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-red-400">✗</span>
                        {row.competitor}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/80">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        {row.ours}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile) */}
          <div className="md:hidden space-y-4">
            {COMPARISON_ROWS.map((row, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-3 text-white/80">{row.feature}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-white/50">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span><strong className="text-white/60">Alexa / Google:</strong> {row.competitor}</span>
                  </div>
                  <div className="flex items-start gap-2 text-white/80">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span><strong className="text-emerald-300">Nosso robô:</strong> {row.ours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Dois caminhos para começar ===== */}
      <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Dois caminhos para colocar no ar
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            A escola escolhe: faz internamente com o time de TI ou contrata nosso time para configurar tudo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DIY */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🛠️</div>
                <h3 className="text-xl font-bold">Faça você mesmo</h3>
              </div>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Para escolas com coordenador de TI ou professores com perfil técnico. Total controle e custo zero de serviço.
              </p>
              <ul className="space-y-3 text-sm text-white/70 mb-8 flex-1">
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Frontend gratuito e pronto</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Use n8n Cloud, self-hosted ou Academy</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Você desenha o fluxo de respostas</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Os dados ficam na escola</li>
              </ul>
              <Link href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-white text-black hover:bg-gray-200 rounded-full transition-all shadow-lg">
                Criar Conta Gratuita
              </Link>
            </div>

            {/* Done-for-you */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-2xl p-8 flex flex-col relative">
              <span className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full shadow-lg">
                RECOMENDADO
              </span>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🤝</div>
                <h3 className="text-xl font-bold">Nós configuramos para você</h3>
              </div>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Para escolas sem time de TI ou que querem agilidade. Subimos o n8n, integramos com os dados da escola e entregamos o robô falando.
              </p>
              <ul className="space-y-3 text-sm text-white/70 mb-8 flex-1">
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Setup completo do n8n</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Integração com os dados da escola</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Personalização visual e de voz</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> Treinamento rápido da equipe</li>
              </ul>
              <a
                href="https://wa.me/555599435002?text=Ol%C3%A1!%20Sou%20de%20uma%20escola%20e%20quero%20a%20configura%C3%A7%C3%A3o%20completa%20do%20rob%C3%B4%20assistente"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black rounded-full transition-all shadow-lg"
              >
                <span>📱</span>
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Opções de n8n ===== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Onde rodar o n8n da escola
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto">
            O frontend é gratuito. Você só precisa de um n8n rodando — escolha o cenário que mais combina com a infraestrutura da escola.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                Forma mais rápida de validar a ideia. Conta gratuita por 14 dias, sem cartão. Ideal para um piloto antes de decidir.
              </p>
              <span className="text-blue-300 text-sm font-medium group-hover:underline">
                Criar conta no n8n Cloud →
              </span>
            </a>

            <div className="bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl mb-4">🖥️</div>
              <h3 className="text-lg font-semibold mb-2">Self-hosted</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Rode em um servidor da própria escola com Docker. Total controle, sem limites, dados em casa. Ideal para escolas com TI estruturada.
              </p>
            </div>

            <a
              href="https://academy.edersonwermeier.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/20 hover:border-violet-400/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10"
            >
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                Academy
                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-medium">pré-configurado</span>
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Membros do <strong className="text-white/70">academy.edersonwermeier.com</strong> têm um n8n pronto, com workflows de exemplo. Caminho mais curto.
              </p>
              <span className="text-violet-300 text-sm font-medium group-hover:underline">
                Acessar Academy →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== Requisitos ===== */}
      <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">O que sua escola precisa</h2>
          <p className="text-white/50 mb-10">Sem servidor caro, sem hardware especial, sem app para instalar.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { icon: '🖥️', text: 'Um computador ou tablet com Chrome ou Edge' },
              { icon: '🌐', text: 'Conexão de internet estável' },
              { icon: '🔌', text: 'Um n8n rodando (Cloud, self-hosted ou Academy)' },
              { icon: '🔗', text: 'Webhook configurado no n8n' },
              { icon: '🆓', text: 'O frontend é gratuito' },
              { icon: '🔒', text: 'Cada conta da escola fica isolada' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-white/70">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Sua escola sem time de TI? ===== */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1B3A6B]/20 to-emerald-500/10 border border-white/10 rounded-3xl p-8 md:p-12 text-center space-y-6">
            <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm font-medium">
              🤝 Sua escola sem time de TI?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              A gente configura tudo
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Não precisa contratar dev, não precisa lidar com Docker, webhooks ou JSON. Nosso time monta o n8n, conecta com os dados da escola e entrega o robô falando. Você só decide <strong className="text-white/80">o que ele vai responder</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <a
                href="https://wa.me/555599435002?text=Ol%C3%A1!%20Sou%20de%20uma%20escola%20e%20quero%20o%20rob%C3%B4%20assistente%20configurado%20pelo%20time%20de%20voc%C3%AAs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-emerald-500 hover:bg-emerald-400 text-black rounded-full transition-all shadow-xl shadow-emerald-500/20 hover:scale-105"
              >
                <span>📱</span>
                Falar no WhatsApp
              </a>
              <span className="text-white/40 text-sm">(55) 99943-5002</span>
            </div>
            <p className="text-white/40 text-xs pt-2">
              Atendemos escolas de educação básica, técnicas, universidades, redes e mantenedoras.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA Final ===== */}
      <section className="px-6 py-20 border-t border-white/5 bg-gradient-to-b from-transparent to-[#1B3A6B]/10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Coloque o robô da sua escola no ar
          </h2>
          <p className="text-white/50 text-lg">
            Crie a conta gratuita e teste o frontend agora. Se quiser, a gente cuida do backend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
            <Link href="/register" className="inline-block px-8 py-4 text-lg font-semibold bg-white text-black hover:bg-gray-200 rounded-full transition-all shadow-xl hover:scale-105">
              Criar Conta Gratuita
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

      {/* ===== Footer ===== */}
      <footer className="p-6 text-center text-white/40 text-sm border-t border-white/10 space-y-2">
        <p>Assistente de Voz para Escolas. Por Ederson Wermeier 🧡</p>
        <p className="text-white/30 text-xs">
          Dúvidas ou suporte? <a href="https://wa.me/555599435002" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">WhatsApp (55) 99943-5002</a>
        </p>
      </footer>
    </div>
  );
}
