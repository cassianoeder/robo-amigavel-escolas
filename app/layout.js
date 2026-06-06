import './globals.css';
import CookieBanner from './components/CookieBanner';

export const metadata = {
  title: 'Assistente de Voz — Robô de IA grátis com n8n',
  description: 'Crie seu próprio assistente de voz de graça. Use n8n Cloud (14 dias grátis), self-hosted, ou o n8n pré-configurado do Academy. Para alunos, professores e curiosos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
