'use strict';

const bufferData = require('../../../bufferData');
const connectionEvents = require('./connectionEvents/connectionEvents');


module.exports = SocketConnection; 


function SocketConnection(newConnection, connectionsHash) {
  this.id = generateConnectionId(newConnection);
  this.connection = newConnection;
  this.localBuffer = Buffer.from([]);
  this.connectionsHash = connectionsHash;
}


SocketConnection.prototype.listen = function() {
  let self = this;
  connectionEvents(self);
  self.connectionsHash.add(self.id, self);
}


SocketConnection.prototype.sendData = function(data) {

  let self = this;

  try {
    self.connection.write(bufferData.bufferize(data));
    return true;

  } catch (err) {
    console.log(err.message);
    return false;
  }
}


// ---------- HELPERS

function generateConnectionId(connection) {

  try {
    return `${connection.remoteAddress}:${connection.remotePort}`;
  
  } catch (err) {
    this.logger.info( this.label, err.message );
    return '';
  }
};