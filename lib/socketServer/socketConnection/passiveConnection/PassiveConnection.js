'use strict';

const bufferData = require('../../../bufferData');

module.exports = PassiveConnection; 


function PassiveConnection(newConnection, socketServer) {

  const passiveConnection = {
    id: generateConnectionId(newConnection),
    connectionsHash: socketServer.connectionsHash,
    connection: newConnection,
    localBuffer: Buffer.from([]),
    sendData: sendData
  };

  listen(passiveConnection);
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


function listen(passiveConnection) {

  // Start Connection Event Listeners;
  onData(passiveConnection);
  onClose(passiveConnection);
  onError(passiveConnection);
  onTimeout(passiveConnection);

  // Add Connection in Server Hash;
  passiveConnection.connectionsHash.add(passiveConnection.id, passiveConnection);
}


// Listeners Logic Implementation
function onData(passiveConnection) {
  
  passiveConnection.connection.on('data', (receivedBuffer) => { console.log(`Connection-Event: 'data', ConnectionId: ${passiveConnection.id}`);
  
    // Split Received Buffer using (STX-ETX);
    let result = bufferData.splitBuffer(Buffer.concat([passiveConnection.localBuffer, receivedBuffer]));

    // Concat Remainder Buffer with localBuffer;
    passiveConnection.localBuffer = Buffer.concat([passiveConnection.localBuffer, result.buffer]);

    // Transform bufferArray into Json Array;
    let dataList = bufferData.bufferToJson(result.spread);


    // for each data message
    dataList.forEach(dataObj => {
      
      console.log(dataObj);

      // Broadcast message Buffer to all clients except author.  
      Object.keys(passiveConnection.connectionsHash.getKeys()).forEach( key => {
        
        if (key !== passiveConnection.id) {
          console.log(`Sending to ${key}`);
          passiveConnection.connectionsHash.get(key).sendData(dataObj)
        }

      });

      
     
    })
    
  })
}


function onClose(passiveConnection) {
  passiveConnection.connection.on('close', (obj) => {
    console.log(`Connection-Event: 'close', ConnectionId: ${passiveConnection.id}`); 
    passiveConnection.connectionsHash.delete(passiveConnection.id);
    passiveConnection.connection.destroy();
  });
}


function onError(passiveConnection) {
  passiveConnection.connection.on('error', (obj) => {
    console.log(`Connection-Event: 'error', ConnectionId: ${passiveConnection.id}`);
    passiveConnection.connectionsHash.delete(passiveConnection.id);
    passiveConnection.connection.destroy();
  });
}


function onTimeout(passiveConnection) {
  passiveConnection.connection.on('timeout', (obj) => {
    console.log(`Connection-Event: 'timeout', ConnectionId: ${passiveConnection.id}`);
    passiveConnection.connectionsHash.delete(passiveConnection.id);
    passiveConnection.connection.destroy();
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