import httpServer from './app';
import { config } from './config';

httpServer.listen(config.apiPort, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${config.apiPort}`);
  /* eslint-enable no-console */
});
