import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { targetUrl, token, payload } = body;

        if (!targetUrl) {
            return NextResponse.json({ error: 'targetUrl is required' }, { status: 400 });
        }

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log(`[Proxy] Repassando requisição para: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type') || '';
        let data;

        if (contentType.includes('application/json')) {
            data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } else {
            data = await response.text();
            return new NextResponse(data, {
                status: response.status,
                headers: { 'Content-Type': contentType }
            });
        }
    } catch (error) {
        console.error('[Proxy] Erro ao repassar requisição:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
