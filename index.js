import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import routes from './src/routes/routesCalls.routes';
import swaggerDocs from './src/swagger';
import {
  schedulingJob,
  isProductExpiredschedulingJob,
} from './src/jobs/schedulingTask';

const app = express();
require('./src/services/auth');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(
//   cors({
//     origin: `${process.env.CALLBACK_URL}/google/callback`,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/home', (req, res) => {
  res.status(200).send('WELCOME!');
});
app.use(routes);
schedulingJob();
isProductExpiredschedulingJob();
const port = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: true,
});

const users = {};

// listening events using socket.io instance
io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', (message) => {
    socket.broadcast.emit('chat-message', { message, name: users[socket.id] });
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});

httpServer.listen(port, () => { console.log(port); });

export default app;
