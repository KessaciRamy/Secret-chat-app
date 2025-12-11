import express from 'express';
import discussionRoutes from './routes/discussionRoute.js'
import { tempUser } from './middleware/tempUser.js';

const app = express();

app.use(express.json());
app.use(tempUser);

app.use('/api/discussions', discussionRoutes);

export default app;