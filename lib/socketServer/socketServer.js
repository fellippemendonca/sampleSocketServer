'use strict';

const net = require('net');
const Hash = require('./helpers/Hash');
const events = require('./socketServerEvents/socketServerEvents');


module.exports = socketServer;


function socketServer(host, port, onDataMethod) {

  const socketServer = {
    service: net.createServer(),
    connectionsHash: new Hash(),
    address: { host: host, port: port }
  }

  socketServer.onDataMethod = onDataMethod || function(socketConnection, data){ console.log(data) };

  listen(socketServer);

  return socketServer;
}


// Socket Server Listeners;
function listen(socketServer) {

  socketServer.service.listen(socketServer.address.port, socketServer.address.host);

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
