import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { initTmi, onNewMessage } from './tmi';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// TMI & SOCKET SETUP
initTmi();
onNewMessage((data: any) => {
  io.sockets.emit('tmi:message', data);
});

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default httpServer;
