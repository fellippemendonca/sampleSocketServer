'use strict';

const net = require('net');
const bufferData = require('../../../helpers/bufferData');
const events = require('./activeConnectionEvents/activeConnectionEvents');


module.exports = ActiveConnection; 


function ActiveConnection(socketServer, newConnection) {

  const activeConnection = {
    id: generateConnectionId(newConnection),
    socketServer: socketServer,
    connection: new net.Socket(),
    localBuffer: Buffer.from([]),
    address: newConnection,
    sendData: sendData
  };

  listen(activeConnection);
  connectToHost(activeConnection);
}


// Start Connection Event Listeners;
function listen(activeConnection) {

  activeConnection.connection.on('data', (receivedBuffer) => {
    events.onData(activeConnection, receivedBuffer);
  });

  activeConnection.connection.on('close', (obj) => {
    events.onClose(activeConnection, obj);
  });
  
  activeConnection.connection.on('error', (obj) => {
    events.onError(activeConnection, obj);
  });
  
  activeConnection.connection.on('timeout', (obj) => {
    events.onTimeout(activeConnection, obj);
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


function connectToHost(activeConnection) {
  console.log(activeConnection.address);
  
  try {
    activeConnection.connection.connect(activeConnection.address.remotePort, activeConnection.address.remoteAddress, () => {
      activeConnection.socketServer.connectionsHash.add(activeConnection.id, activeConnection);
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
