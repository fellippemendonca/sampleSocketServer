'use strict';

const net = require('net');
const Hash = require('../../lib/Hash');
const address = require('../../app/config');
const ActiveConnection = require('./socketConnection/activeConnection/ActiveConnection');
const PassiveConnection = require('./socketConnection/passiveConnection/PassiveConnection');


module.exports = SocketServer;


function SocketServer() {

  const socketServer = {
    service: net.createServer(),
    connectionsHash: new Hash()
  }

  listen(socketServer);
  connect(socketServer);
}


// Socket Server Listeners;
function listen(socketServer) {

  socketServer.service.listen(address.port, address.host);

  // Event Listeners
  onConnection(socketServer);
  onListening(socketServer);
  onClose(socketServer);
  onError(socketServer);
}

// Event Listeners Logic Implementation
function connect(socketServer) {
  let obj = { remoteAddress: 'localhost', remotePort: 5333 };
  ActiveConnection(obj, socketServer);
  console.log(`Server-Event: 'Active connection', connectionId: ${obj.remoteAddress}:${obj.remotePort}`);
}


// Event Listeners Logic Implementation
function onConnection(socketServer) {
  socketServer.service.on('connection', (obj) => {
    PassiveConnection(obj, socketServer);
    console.log(`Server-Event: 'Passive connection', connectionId: ${obj.remoteAddress}:${obj.remotePort}`);
  });
}


function onListening(socketServer) {
  socketServer.service.on('listening', (obj) => {
    console.log(`Server-Event: 'listening'`);
  });
}


function onClose(socketServer) {
  socketServer.service.on('close', (obj) => {
    console.log(`Server-Event: 'Close'`);
  });
}


function onError(socketServer) {
  socketServer.service.on('error', (obj) => {
    console.log(`Server-Event: 'Error', Message: ${err.message}`);
  });
}
