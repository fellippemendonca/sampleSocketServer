'use strict';

module.exports = onDataEvents;


function onDataEvents(socketConnection, data) {

  //console.log(data);

    // Broadcast message Buffer to all clients except author.  
    Object.keys(socketConnection.socketServer.connectionsHash.getKeys()).forEach( key => {
      
      if (key !== socketConnection.id) {
        console.log(`Sending to ${key}`);
        socketConnection.socketServer.connectionsHash.get(key).sendData(data)
      }

    });
};
