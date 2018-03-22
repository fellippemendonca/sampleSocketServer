'use strict';

const bufferData = require('../../../helpers/bufferData');
const events = require('./passiveConnectionEvents/passiveConnectionEvents');


module.exports = PassiveConnection; 


function PassiveConnection(socketServer, newConnection) {

  const passiveConnection = {
    id: generateConnectionId(newConnection),
    socketServer: socketServer,
    connection: newConnection,
    localBuffer: Buffer.from([]),
    sendData: sendData
  };
  
  listen(passiveConnection);
}


// Connection Event Listeners;
function listen(passiveConnection) {

  passiveConnection.socketServer.connectionsHash.add(passiveConnection.id, passiveConnection);
  
  passiveConnection.connection.on('data', (receivedBuffer) => {
    events.onData(passiveConnection, receivedBuffer);
  });

  passiveConnection.connection.on('close', (obj) => {
    events.onClose(passiveConnection, obj);
  });
  
  passiveConnection.connection.on('error', (obj) => {
    events.onError(passiveConnection, obj);
  });
  
  passiveConnection.connection.on('timeout', (obj) => {
    events.onTimeout(passiveConnection, obj);
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
