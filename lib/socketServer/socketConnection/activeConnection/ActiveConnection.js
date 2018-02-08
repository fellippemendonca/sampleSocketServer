'use strict';

const net = require('net');
const bufferData = require('../../../bufferData');
const events = require('./activeConnectionEvents/activeConnectionEvents');


module.exports = activeConnection; 


function activeConnection(socketServer, newConnection) {

  const currentConnection = {
    id: generateConnectionId(newConnection),
    connectionsHash: socketServer.connectionsHash,
    connection: new net.Socket(),
    localBuffer: Buffer.from([]),
    address: newConnection,
    sendData: sendData
  };

  listen(currentConnection);
  connectToHost(currentConnection);
}


// Start Connection Event Listeners;
function listen(currentConnection) {

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


function connectToHost(currentConnection) {
  console.log(currentConnection.address);
  
  try {
    currentConnection.connection.connect(currentConnection.address.remotePort, currentConnection.address.remoteAddress, () => {
      currentConnection.connectionsHash.add(currentConnection.id, currentConnection);
    })
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
}
