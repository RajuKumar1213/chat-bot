import { httpServer } from './app';
import connectDB from './db/index';
import './workers/upload.worker';

const PORT = Number(process.env.PORT) || 8000;

connectDB()
  .then(() => {
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`⚙️  Server is running on port ${PORT}`);
    });
    httpServer.on('error', (error) => console.log('ERROR', error));
  })
  .catch((error) => {
    console.log('MONGODB CONNECTION ERROR', error);
  });
