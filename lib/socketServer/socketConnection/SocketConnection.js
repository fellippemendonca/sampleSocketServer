'use strict';

const bufferData = require('../../bufferData');

module.exports = SocketConnection; 


function SocketConnection(newConnection, connectionsHash) {

  let self = this;

  self.id = generateConnectionId(newConnection);
  self.connectionsHash = connectionsHash;
  self.connection = newConnection;
  self.localBuffer = Buffer.from([]);
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


SocketConnection.prototype.listen = function() {
  
  let self = this;

  // Start Connection Event Listeners;
  self.onData();
  self.onClose();
  self.onError();
  self.onTimeout();

  // Add Connection in Server Hash;
  self.connectionsHash.add(self.id, self);

}


// Listeners Logic Implementation
SocketConnection.prototype.onData = function() {
  
  let self = this;

  self.connection.on('data', (obj) => { console.log(`Connection-Event: 'data', ConnectionId: ${self.id}`);
  
    // Split Received Buffer using (STX-ETX);
    let result = bufferData.splitBuffer(Buffer.concat([self.localBuffer, obj]));

    // Concat Remainder Buffer with localBuffer;
    self.localBuffer = Buffer.concat([self.localBuffer, result.buffer]);

    // Transform bufferArray into Json Array;
    let parsedJson = bufferData.bufferToJson(result.spread);


    // for each buffer message
    for (let i in parsedJson) {
      
      let dataObj = parsedJson[i];
      console.log(dataObj);

      // Broadcast message Buffer to all clients except author.
      for (let idx in self.connectionsHash.getKeys()) {
        idx !== self.id ? self.connectionsHash.get(idx).sendData(dataObj) : false;
      }
     
    }
    
  })
}


SocketConnection.prototype.onClose = function() {

  let self = this;

  self.connection.on('close', (obj) => {
    console.log(`Connection-Event: 'close', ConnectionId: ${self.id}`); 
    self.connectionsHash.delete(self.id);
    self.connection.destroy();
  });
}


SocketConnection.prototype.onError = function() {

  let self = this;

  self.connection.on('error', (obj) => {
    console.log(`Connection-Event: 'error', ConnectionId: ${self.id}`);
    self.connectionsHash.delete(self.id);
    self.connection.destroy();
  });
}


SocketConnection.prototype.onTimeout = function() {

  let self = this;

  self.connection.on('timeout', (obj) => {
    console.log(`Connection-Event: 'timeout', ConnectionId: ${self.id}`);
    self.connectionsHash.delete(self.id);
    self.connection.destroy();
  });
}


// ---------- HELPERS
function generateConnectionId(connection) {
  try { 
    return `${connection.remoteAddress}:${connection.remotePort}`;

  } catch (err) {
    console.log(err.message);
    return '';
  }
};