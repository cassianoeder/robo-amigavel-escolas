export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { targetUrl, token, payload } = req.body;

        if (!targetUrl) {
            return res.status(400).json({ error: 'targetUrl is required' });
        }

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type') || '';
        let data;

        if (contentType.includes('application/json')) {
            data = await response.json();
            return res.status(response.status).json(data);
        } else {
            data = await response.text();
            return res.status(response.status).send(data);
        }

    } catch (error) {
        console.error('Error in proxy:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
