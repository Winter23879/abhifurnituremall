import dotenv from 'dotenv';
dotenv.config();
import { connectToDatabase } from '../api/lib/db';
import { ProductModel } from '../api/models';
import { PRODUCTS } from '../src/data/products';

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await connectToDatabase();
  console.log(`Connected. Upserting ${PRODUCTS.length} catalog items into MongoDB...`);

  let added = 0;
  let updated = 0;

  for (const prod of PRODUCTS) {
    const existing = await ProductModel.findOne({ id: prod.id });
    if (existing) {
      await ProductModel.updateOne({ id: prod.id }, { $set: prod });
      updated++;
    } else {
      await ProductModel.create(prod);
      added++;
    }
  }

  const count = await ProductModel.countDocuments();
  console.log(`Database sync completed successfully!`);
  console.log(`Items added: ${added}, Items updated: ${updated}, Total in DB: ${count}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
