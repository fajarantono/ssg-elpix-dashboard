// pages/api/video-proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    const videoRes = await fetch(url, {
      headers: {
        // Tambahkan ini jika video protected by token
        // Authorization: 'Bearer your_token_if_needed',
      },
    });

    if (!videoRes.ok) {
      return res.status(videoRes.status).json({ error: 'Failed to fetch video' });
    }

    const contentType = videoRes.headers.get('content-type') || 'video/mp4';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    // Optional: untuk streaming support
    res.setHeader('Accept-Ranges', 'bytes');

    const reader = videoRes.body?.getReader();
    if (!reader) return res.status(500).send('No video stream');

    const encoder = new TextEncoder();

    const pump = async () => {
      const { value, done } = await reader.read();
      if (done) return res.end();
      res.write(value);
      return pump();
    };

    await pump();
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Proxy failed' });
  }
}
