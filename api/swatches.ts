import { connectToDatabase } from './lib/db';
import { SwatchRequestModel } from './models';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    // GET /api/swatches -> List sample box requests
    if (req.method === 'GET') {
      const swatches = await SwatchRequestModel.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json(swatches);
    }

    // POST /api/swatches -> Request swatch kit
    if (req.method === 'POST') {
      const data = req.body;
      if (!data || !data.id || !data.name || !data.phone || !data.pinCode || !data.address) {
        return res.status(400).json({ error: 'Missing required swatch fields' });
      }

      const swatch = await SwatchRequestModel.create(data);
      return res.status(201).json(swatch);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API /swatches Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
