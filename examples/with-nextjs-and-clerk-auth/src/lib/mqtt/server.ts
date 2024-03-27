import Aedes from 'aedes';
import { createServer } from 'net';

const aedes = new Aedes();
const server = createServer(aedes.handle);
const port = 1883;

server.listen(port, function () {
  console.log('🔊 MQTT Server started and listening on port: ', port);
});
