'use strict';

const ActiveConnection = require('./socketConnection/activeConnection/ActiveConnection');
const PassiveConnection = require('./socketConnection/passiveConnection/PassiveConnection');

module.exports = {
  connect: connect,
  onConnection: onConnection,
  onListening: onListening,
  onClose: onClose,
  onError: onError
}


// Event Listeners Logic Implementation
function connect(socketServer) {
  let obj = { remoteAddress: 'localhost', remotePort: 5333 };
  ActiveConnection(socketServer, obj);
  console.log(`Server-Event: 'Active connection', connectionId: ${obj.remoteAddress}:${obj.remotePort}`);
}


// Event Listeners Logic Implementation
function onConnection(socketServer, obj) {
  console.log(`Server-Event: 'Passive connection', connectionId: ${obj.remoteAddress}:${obj.remotePort}`);
  PassiveConnection(socketServer, obj);
}


function onListening(socketServer) {
  console.log(`Server-Event: 'listening'`);
}


function onClose(socketServer) {
  console.log(`Server-Event: 'Close'`);
}


function onError(socketServer) {
  console.log(`Server-Event: 'Error', Message: ${err.message}`);
}
