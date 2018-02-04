'use strict';

const SocketConnection = require('./socketConnection/SocketConnection');

module.exports = serverEvents;

function serverEvents (socketServer) {
  socketServer.on('listening', (obj) => {
    console.log(`Server-Event: 'listening'`);
  });
  
  socketServer.on('connection', (connection) => {
    console.log(`Server-Event: 'connection'`);
    let socketConnection = new SocketConnection(connection, socketServer.connectionsHash);
    socketConnection.listen();
  });

  socketServer.on('close', (obj) => {
    console.log(`Server-Event: 'Close'`);
  });
  
  socketServer.on('error', (obj) => {
    console.log(`Server-Event: 'Error', Message: ${err.message}`);
  });
}
