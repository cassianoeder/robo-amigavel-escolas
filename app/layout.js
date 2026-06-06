import './globals.css';
import CookieBanner from './components/CookieBanner';

export const metadata = {
  title: 'Meu Robô Personalizado — Aprenda IA, Automação e Programação',
  description: 'Projeto educacional gratuito para adolescentes aprenderem sobre webhooks, JSON, n8n, IA e lógica de programação criando seu próprio robô assistente de voz.',
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
