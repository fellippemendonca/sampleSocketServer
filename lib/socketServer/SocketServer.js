'use strict';

const net = require('net');
const Hash = require('../../lib/Hash');
const address = require('../../app/config');
const events = require('./socketServerEvents/socketServerEvents');

module.exports = SocketServer;


function SocketServer() {

  const socketServer = {
    service: net.createServer(),
    connectionsHash: new Hash()
  }

  listen(socketServer);

  events.connect(socketServer);
}


// Socket Server Listeners;
function listen(socketServer) {

  socketServer.service.listen(address.port, address.host);

  socketServer.service.on('connection', (obj) => {
    events.onConnection(socketServer, obj);
  });
  
  socketServer.service.on('listening', (obj) => {
    events.onListening(socketServer, obj);
  });
  
  socketServer.service.on('close', (obj) => {
    events.onClose(socketServer, obj);
  });
  
  socketServer.service.on('error', (obj) => {
    events.onError(socketServer, obj);
  });
  
}
