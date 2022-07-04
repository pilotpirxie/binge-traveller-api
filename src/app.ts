import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middlewares/errors';
import searchController from './controllers/search.controller';

dotenv.config();
const port = process.env.PORT;
const app: Express = express();

app.use(express.static(path.join(__dirname, 'public')));

// app.get('(/*)?', async (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.use('/search', searchController);

app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
