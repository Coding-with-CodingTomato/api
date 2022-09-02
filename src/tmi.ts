import tmi from 'tmi.js';
import config from './config';

let tmiClient: tmi.Client;

interface MessageEvent {
  channel: string;
  tags: tmi.ChatUserstate;
  message: string;
  self: boolean;
}

let newMessageCB: Function;
export const onNewMessage = (data?: Function | MessageEvent) => {
  if (typeof data === 'function') {
    newMessageCB = data;
    return;
  }

  newMessageCB(data);
};
export const initTmi = () => {
  tmiClient = new tmi.Client({
    channels: [config.twitchUsername],
  });

  tmiClient.connect();

  tmiClient.on('message', (channel, tags, message, self) => {
    onNewMessage({ channel, tags, message, self });
  });
};
