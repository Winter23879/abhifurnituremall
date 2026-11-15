import { connectToDatabase } from './lib/db';
import { OrderModel } from './models';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    // GET /api/orders -> Admin orders list
    if (req.method === 'GET') {
      const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json(orders);
    }

    // POST /api/orders -> New order checkout
    if (req.method === 'POST') {
      const data = req.body;
      if (!data || !data.id || !data.clientName || !data.total) {
        return res.status(400).json({ error: 'Missing required order fields' });
      }

      const order = await OrderModel.create(data);
      return res.status(201).json(order);
    }

    // PATCH /api/orders -> Update order status
    if (req.method === 'PATCH') {
      const { id, status } = req.body || {};
      if (!id || !status) {
        return res.status(400).json({ error: 'Missing order ID or status' });
      }

      const updated = await OrderModel.findOneAndUpdate(
        { id },
        { $set: { status } },
        { new: true }
      );
      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API /orders Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
