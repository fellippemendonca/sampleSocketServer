'use strict';

const net = require('net');
const Hash = require('../../lib/Hash');
const address = require('../../app/config');
const serverEvents = require('./serverEvents/serverEvents');

module.exports = SocketServer;


function SocketServer() {
  this.socketServer = net.createServer();
  this.socketServer.connectionsHash = new Hash();
}


SocketServer.prototype.listen = function() {
  
  let self = this;
  
  self.socketServer.listen(address.port, address.host);
  serverEvents(self.socketServer);

}
