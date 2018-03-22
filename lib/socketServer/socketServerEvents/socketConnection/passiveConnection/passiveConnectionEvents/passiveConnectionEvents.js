'use strict';

const bufferData = require('../../../../helpers/bufferData');

module.exports = {
  onData: onData,
  onClose: onClose,
  onError: onError,
  onTimeout: onTimeout
};


// Events Logic Implementation
function onData(passiveConnection, receivedBuffer) {

  console.log(`Connection-Event: 'data', ConnectionId: ${passiveConnection.id}`);

  // Split Received Buffer using (STX-ETX);
  let result = bufferData.splitBuffer(Buffer.concat([passiveConnection.localBuffer, receivedBuffer]));

  // Concat Remainder Buffer with localBuffer;
  passiveConnection.localBuffer = Buffer.concat([passiveConnection.localBuffer, result.buffer]);

  // Transform bufferArray into Json Array;
  let dataList = bufferData.bufferToJson(result.spread);


  // for each data message
  dataList.forEach(dataObj => {
    passiveConnection.socketServer.onDataMethod(passiveConnection, dataObj);
  });
}


function onClose(passiveConnection) {
  console.log(`Connection-Event: 'close', ConnectionId: ${passiveConnection.id}`); 
  passiveConnection.socketServer.connectionsHash.delete(passiveConnection.id);
  passiveConnection.connection.destroy();
}


function onError(passiveConnection) {
  console.log(`Connection-Event: 'error', ConnectionId: ${passiveConnection.id}`);
  passiveConnection.socketServer.connectionsHash.delete(passiveConnection.id);
  passiveConnection.connection.destroy();
}


function onTimeout(passiveConnection) {
  console.log(`Connection-Event: 'timeout', ConnectionId: ${passiveConnection.id}`);
  passiveConnection.socketServer.connectionsHash.delete(passiveConnection.id);
  passiveConnection.connection.destroy();
}
