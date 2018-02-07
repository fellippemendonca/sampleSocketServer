'use strict';

const net = require('net');

const bufferData = require('../../../bufferData');

module.exports = ActiveConnection; 


function ActiveConnection(newConnection, socketServer) {

  const activeConnection = {
    id: generateConnectionId(newConnection),
    connectionsHash: socketServer.connectionsHash,
    connection: new net.Socket(),
    localBuffer: Buffer.from([]),
    address: newConnection,
    sendData: sendData
  };

  listen(activeConnection);
  connectToHost(activeConnection);
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

function connectToHost(activeConnection) { console.log(activeConnection.address);
  try {
    activeConnection.connection.connect(activeConnection.address.remotePort, activeConnection.address.remoteAddress, () => {
      return true;
    })
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}


function listen(activeConnection) {

  // Start Connection Event Listeners;
  onData(activeConnection);
  onClose(activeConnection);
  onError(activeConnection);
  onTimeout(activeConnection);

  // Add Connection in Server Hash;
  activeConnection.connectionsHash.add(activeConnection.id, activeConnection);
}


// Listeners Logic Implementation
function onData(activeConnection) {
  
  activeConnection.connection.on('data', (receivedBuffer) => { console.log(`Connection-Event: 'data', ConnectionId: ${activeConnection.id}`);
  
    // Split Received Buffer using (STX-ETX);
    let result = bufferData.splitBuffer(Buffer.concat([activeConnection.localBuffer, receivedBuffer]));

    // Concat Remainder Buffer with localBuffer;
    activeConnection.localBuffer = Buffer.concat([activeConnection.localBuffer, result.buffer]);

    // Transform bufferArray into Json Array;
    let dataList = bufferData.bufferToJson(result.spread);


    // for each data message
    dataList.forEach(dataObj => {
      
      console.log(dataObj);

      // Broadcast message Buffer to all clients except author.  
      Object.keys(activeConnection.connectionsHash.getKeys()).forEach( key => {
        
        if (key !== activeConnection.id) {
          console.log(`Sending to ${key}`);
          activeConnection.connectionsHash.get(key).sendData(dataObj)
        }

      });

      
     
    })
    
  })
}


function onClose(activeConnection) {
  activeConnection.connection.on('close', (obj) => {
    console.log(`Connection-Event: 'close', ConnectionId: ${activeConnection.id}`); 
    activeConnection.connectionsHash.delete(activeConnection.id);
    activeConnection.connection.destroy();
  });
}


function onError(activeConnection) {
  activeConnection.connection.on('error', (obj) => {
    console.log(`Connection-Event: 'error', ConnectionId: ${activeConnection.id}`);
    activeConnection.connectionsHash.delete(activeConnection.id);
    activeConnection.connection.destroy();
  });
}


function onTimeout(activeConnection) {
  activeConnection.connection.on('timeout', (obj) => {
    console.log(`Connection-Event: 'timeout', ConnectionId: ${activeConnection.id}`);
    activeConnection.connectionsHash.delete(activeConnection.id);
    activeConnection.connection.destroy();
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