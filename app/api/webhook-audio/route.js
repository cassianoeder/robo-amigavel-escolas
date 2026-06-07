import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const targetUrl = formData.get('targetUrl');
    const token = formData.get('token') || '';
    const audio = formData.get('audio');
    const metadataStr = formData.get('metadata') || '{}';
    const tipo = formData.get('tipo') || 'fish-stt';

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'targetUrl is required' },
        { status: 400 }
      );
    }

    if (!(audio instanceof Blob)) {
      return NextResponse.json(
        { error: 'audio blob is required' },
        { status: 400 }
      );
    }

    if (audio.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio exceeds 10MB limit' },
        { status: 413 }
      );
    }

    const forwardForm = new FormData();
    forwardForm.append('audio', audio, 'recording.webm');
    forwardForm.append('metadata', metadataStr);
    forwardForm.append('tipo', tipo);

    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    console.log(`[Proxy Audio] Repassando (tipo=${tipo}, size=${audio.size}B) para: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: forwardForm
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': contentType }
    });
  } catch (error) {
    console.error('[Proxy Audio] Erro:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
