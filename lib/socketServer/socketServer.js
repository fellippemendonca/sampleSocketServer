'use strict';

const net = require('net');
const Hash = require('../../lib/Hash');
const address = require('../../app/config');
const events = require('./socketServerEvents/socketServerEvents');

module.exports = socketServer;


function socketServer() {

  const socketServer = {
    service: net.createServer(),
    connectionsHash: new Hash()
  }

  listen(socketServer);

  return socketServer;
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

  //events.connect(socketServer);
  
}
