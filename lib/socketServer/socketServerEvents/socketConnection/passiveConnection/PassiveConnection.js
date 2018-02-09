'use strict';

const bufferData = require('../../../../bufferData');
const events = require('./passiveConnectionEvents/passiveConnectionEvents');


module.exports = PassiveConnection; 


function PassiveConnection(socketServer, newConnection) {

  const currentConnection = {
    id: generateConnectionId(newConnection),
    connectionsHash: socketServer.connectionsHash,
    connection: newConnection,
    localBuffer: Buffer.from([]),
    sendData: sendData
  };
  
  listen(currentConnection);
}


// Connection Event Listeners;
function listen(currentConnection) {

  currentConnection.connectionsHash.add(currentConnection.id, currentConnection);
  
  currentConnection.connection.on('data', (receivedBuffer) => {
    events.onData(currentConnection, receivedBuffer);
  });

  currentConnection.connection.on('close', (obj) => {
    events.onClose(currentConnection, obj);
  });
  
  currentConnection.connection.on('error', (obj) => {
    events.onError(currentConnection, obj);
  });
  
  currentConnection.connection.on('timeout', (obj) => {
    events.onTimeout(currentConnection, obj);
  });
  
}


function sendData(data) {
  try {
    this.connection.write(bufferData.bufferize(data));
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
    console.log(err.message);
    return '';
  }
};
