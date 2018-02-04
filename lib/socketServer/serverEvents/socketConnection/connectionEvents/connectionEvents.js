'use strict';

const bufferData = require('../../../../bufferData');


module.exports = connectionEvents; 

function connectionEvents (socketConnection) {
  let id = socketConnection.id;
  let connection = socketConnection.connection;
  let localBuffer = socketConnection.localBuffer;
  let connectionsHash = socketConnection.connectionsHash;

  connection.on('data', (obj) => { console.log(`Connection-Event: 'data', ConnectionId: ${id}`);
  
    // Split Received Buffer using (STX-ETX);
    let result = bufferData.splitBuffer(Buffer.concat([localBuffer, obj]));

    // Concat Remainder Buffer with localBuffer;
    localBuffer = Buffer.concat([localBuffer, result.buffer]);

    // Transform bufferArray into Json Array;
    let parsedJson = bufferData.bufferToJson(result.spread);


    // for each buffer message
    for (let i in parsedJson) {
      
      let dataObj = parsedJson[i];
      console.log(dataObj);

      // Broadcast message Buffer to all clients except author.
      for (let idx in connectionsHash.keys) {
        idx !== id ? connectionsHash.get(idx).sendData(dataObj) : false;
      }
     
    }
    
  });
  
  connection.on('close', (obj) => {
    console.log(`Connection-Event: 'close', ConnectionId: ${id}`); 
    connectionsHash.delete(id);
    connection.destroy();
  });

  connection.on('error', (obj) => {
    console.log(`Connection-Event: 'error', ConnectionId: ${id}`);
    connectionsHash.delete(id);
    connection.destroy();
  });

  connection.on('timeout', (obj) => {
    console.log(`Connection-Event: 'timeout', ConnectionId: ${id}`);
    connectionsHash.delete(id);
    connection.destroy();
  });

}
