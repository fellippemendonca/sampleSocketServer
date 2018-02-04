'use strict';

const net = require('net');
const Hash = require('../../lib/Hash');
const address = require('../../app/config');
const SocketConnection = require('./socketConnection/SocketConnection');

module.exports = SocketServer;


function SocketServer() {
  this.socketServer = net.createServer();
  this.socketServer.connectionsHash = new Hash();
}


SocketServer.prototype.listen = function() {
  
  let self = this;
  
  self.socketServer.listen(address.port, address.host);

  // Start Server Event Listeners;
  self.onListening();
  self.onConnection();
  self.onClose();
  self.onError();
}


// Listeners Logic Implementation
SocketServer.prototype.onListening = function() {

  let self = this;
  
  self.socketServer.on('listening', (obj) => {
    console.log(`Server-Event: 'listening'`);
  });
}


SocketServer.prototype.onConnection = function() {

  let self = this;
  
  self.socketServer.on('connection', (obj) => {
    console.log(`Server-Event: 'connection'`);
    let socketConnection = new SocketConnection(obj, self.socketServer.connectionsHash);
    socketConnection.listen();
  });
}


SocketServer.prototype.onClose = function() {

  let self = this;
  
  self.socketServer.on('close', (obj) => {
    console.log(`Server-Event: 'Close'`);
  });
}


SocketServer.prototype.onError = function() {

  let self = this;
  
  self.socketServer.on('error', (obj) => {
    console.log(`Server-Event: 'Error', Message: ${err.message}`);
  });
}