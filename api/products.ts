import { connectToDatabase } from './lib/db';
import { ProductModel } from './models';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    // GET /api/products -> Fetch all pieces
    if (req.method === 'GET') {
      const products = await ProductModel.find().lean();
      return res.status(200).json(products);
    }

    // POST /api/products -> Add new piece (from Admin Studio)
    if (req.method === 'POST') {
      const data = req.body;
      if (!data || !data.id || !data.name || !data.price) {
        return res.status(400).json({ error: 'Missing required product fields' });
      }
      const created = await ProductModel.findOneAndUpdate(
        { id: data.id },
        { $set: data },
        { upsert: true, new: true }
      );
      return res.status(201).json(created);
    }

    // PUT /api/products -> Update existing piece
    if (req.method === 'PUT') {
      const data = req.body;
      if (!data || !data.id) {
        return res.status(400).json({ error: 'Missing product ID' });
      }
      const updated = await ProductModel.findOneAndUpdate(
        { id: data.id },
        { $set: data },
        { new: true }
      );
      return res.status(200).json(updated);
    }

    // DELETE /api/products -> Delete piece
    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'Missing product ID to delete' });
      }
      await ProductModel.deleteOne({ id });
      return res.status(200).json({ success: true, deletedId: id });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API /products Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
