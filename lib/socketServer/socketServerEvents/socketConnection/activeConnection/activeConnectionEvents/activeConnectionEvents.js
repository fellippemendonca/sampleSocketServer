'use strict';

const bufferData = require('../../../../helpers/bufferData');

module.exports = {
  onData: onData,
  onClose: onClose,
  onError: onError,
  onTimeout: onTimeout
}; 


// Events Logic Implementation
function onData(currentConnection, receivedBuffer) {

  console.log(`Connection-Event: 'data', ConnectionId: ${currentConnection.id}`);

  // Split Received Buffer using (STX-ETX);
  let result = bufferData.splitBuffer(Buffer.concat([currentConnection.localBuffer, receivedBuffer]));

  // Concat Remainder Buffer with localBuffer;
  currentConnection.localBuffer = Buffer.concat([currentConnection.localBuffer, result.buffer]);

  // Transform bufferArray into Json Array;
  let dataList = bufferData.bufferToJson(result.spread);


  // for each data message
  dataList.forEach(dataObj => {
    
    console.log(dataObj);

    // Broadcast message Buffer to all clients except author.  
    Object.keys(currentConnection.connectionsHash.getKeys()).forEach( key => {
      
      if (key !== currentConnection.id) {
        console.log(`Sending to ${key}`);
        currentConnection.connectionsHash.get(key).sendData(dataObj)
      }

    });
    
  });
  
}


function onClose(currentConnection) {
  console.log(`Connection-Event: 'close', ConnectionId: ${currentConnection.id}`); 
  currentConnection.connectionsHash.delete(currentConnection.id);
  currentConnection.connection.destroy();
}


function onError(currentConnection) {
  console.log(`Connection-Event: 'error', ConnectionId: ${currentConnection.id}`);
  currentConnection.connectionsHash.delete(currentConnection.id);
  currentConnection.connection.destroy();
}


function onTimeout(currentConnection) {
  console.log(`Connection-Event: 'timeout', ConnectionId: ${currentConnection.id}`);
  currentConnection.connectionsHash.delete(currentConnection.id);
  currentConnection.connection.destroy();
}
