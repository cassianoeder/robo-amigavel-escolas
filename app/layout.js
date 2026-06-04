export const metadata = {
  title: 'Robô Amigável — Assistente Escolar',
  description: 'Robô amigável interativo para escolas com reconhecimento de voz e integração n8n.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
