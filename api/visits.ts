import { connectToDatabase } from './lib/db';
import { ShowroomVisitModel } from './models';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    // GET /api/visits -> List showroom bookings
    if (req.method === 'GET') {
      const visits = await ShowroomVisitModel.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json(visits);
    }

    // POST /api/visits -> Book a showroom visit
    if (req.method === 'POST') {
      const data = req.body;
      if (!data || !data.id || !data.name || !data.phone || !data.visitDate) {
        return res.status(400).json({ error: 'Missing required visit fields' });
      }

      const visit = await ShowroomVisitModel.create(data);
      return res.status(201).json(visit);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API /visits Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
