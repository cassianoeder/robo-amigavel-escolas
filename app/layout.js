import Script from 'next/script';

export const metadata = {
  title: 'Robô Amigável — Assistente Escolar',
  description: 'Robô amigável interativo para escolas com reconhecimento de voz e integração n8n.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/style.css" />
      </head>
      <body>
        {children}

        {/* Load our Vanilla JS modules sequentially */}
        <Script src="/js/config.js" strategy="beforeInteractive" />
        <Script src="/js/robot-face.js" strategy="beforeInteractive" />
        <Script src="/js/speech.js" strategy="beforeInteractive" />
        <Script src="/js/motion.js" strategy="beforeInteractive" />
        <Script src="/js/webhook.js" strategy="beforeInteractive" />
        <Script src="/js/app.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
