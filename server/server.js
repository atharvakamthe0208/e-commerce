import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import seedDatabase from './src/utils/seed.js';

dotenv.config();

const shouldSeedDemoData = () => {
  const configuredUri = process.env.MONGO_URI?.trim();
  return !configuredUri || configuredUri.includes('<db_username>') || configuredUri.includes('<db_password>');
};

const startServer = async () => {
  await connectDB();

  if (shouldSeedDemoData()) {
    await seedDatabase();
  }

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  return server;
};

const server = await startServer();

export default server;
