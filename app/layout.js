import './globals.css';
import CookieBanner from './components/CookieBanner';

export const metadata = {
  title: 'Robô Assistente para Escolas — Frontend pronto, backend configurável',
  description: 'Robô assistente de voz pronto para a sua escola. Frontend completo e personalizável; integração com seus dados via n8n. Configure você mesmo ou contrate nosso time para deixar tudo rodando.',
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
