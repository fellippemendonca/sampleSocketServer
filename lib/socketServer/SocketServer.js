'use strict';

const net = require('net');
const Hash = require('../../lib/Hash');
const address = require('../../app/config');
const SocketConnection = require('./socketConnection/SocketConnection');

module.exports = SocketServer;


function SocketServer() {

  const socketServer = net.createServer();
  socketServer.connectionsHash = new Hash();

  listen(socketServer);
}


// Socket Server Listeners;
function listen(socketServer) {

  socketServer.listen(address.port, address.host);

  // Event Listeners
  onConnection(socketServer);
  onListening(socketServer);
  onClose(socketServer);
  onError(socketServer);
}


// Event Listeners Logic Implementation
function onConnection(socketServer) {
  socketServer.on('connection', (obj) => {
    SocketConnection(obj, socketServer.connectionsHash);
    console.log(`Server-Event: 'connection', connectionId: ${obj.remoteAddress}:${obj.remotePort}`);
  });
}


function onListening(socketServer) {
  socketServer.on('listening', (obj) => {
    console.log(`Server-Event: 'listening'`);
  });
}


function onClose(socketServer) {
  socketServer.on('close', (obj) => {
    console.log(`Server-Event: 'Close'`);
  });
}


function onError(socketServer) {
  socketServer.on('error', (obj) => {
    console.log(`Server-Event: 'Error', Message: ${err.message}`);
  });
}
