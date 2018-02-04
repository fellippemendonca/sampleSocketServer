'use strict';

const bufferData = require('../../bufferData');

module.exports = SocketConnection; 


function SocketConnection(newConnection, connectionsHash) {

  const socketConnection = {
    id: generateConnectionId(newConnection),
    connectionsHash: connectionsHash,
    connection: newConnection,
    localBuffer: Buffer.from([]),
    sendData: sendData
  };

  listen(socketConnection);
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


function listen(socketConnection) {

  // Start Connection Event Listeners;
  onData(socketConnection);
  onClose(socketConnection);
  onError(socketConnection);
  onTimeout(socketConnection);

  // Add Connection in Server Hash;
  socketConnection.connectionsHash.add(socketConnection.id, socketConnection);
}


// Listeners Logic Implementation
function onData(socketConnection) {
  
  socketConnection.connection.on('data', (receivedBuffer) => { console.log(`Connection-Event: 'data', ConnectionId: ${socketConnection.id}`);
  
    // Split Received Buffer using (STX-ETX);
    let result = bufferData.splitBuffer(Buffer.concat([socketConnection.localBuffer, receivedBuffer]));

    // Concat Remainder Buffer with localBuffer;
    socketConnection.localBuffer = Buffer.concat([socketConnection.localBuffer, result.buffer]);

    // Transform bufferArray into Json Array;
    let dataList = bufferData.bufferToJson(result.spread);


    // for each data message
    dataList.forEach(dataObj => {
      
      // Broadcast message Buffer to all clients except author.  
      Object.keys(socketConnection.connectionsHash.getKeys()).forEach( key => {
        if (key !== socketConnection.id === true) { socketConnection.connectionsHash.get(key).sendData(dataObj) }
      });

      console.log(dataObj);
     
    })
    
  })
}


function onClose(socketConnection) {
  socketConnection.connection.on('close', (obj) => {
    console.log(`Connection-Event: 'close', ConnectionId: ${socketConnection.id}`); 
    socketConnection.connectionsHash.delete(socketConnection.id);
    socketConnection.connection.destroy();
  });
}


function onError(socketConnection) {
  socketConnection.connection.on('error', (obj) => {
    console.log(`Connection-Event: 'error', ConnectionId: ${socketConnection.id}`);
    socketConnection.connectionsHash.delete(socketConnection.id);
    socketConnection.connection.destroy();
  });
}


function onTimeout(socketConnection) {
  socketConnection.connection.on('timeout', (obj) => {
    console.log(`Connection-Event: 'timeout', ConnectionId: ${socketConnection.id}`);
    socketConnection.connectionsHash.delete(socketConnection.id);
    socketConnection.connection.destroy();
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