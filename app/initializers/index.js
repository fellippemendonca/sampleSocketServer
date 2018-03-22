'use strict';

const address = require('../../config');
const socketServer = require('../../lib/socketServer/socketServer');
const onDataMethod = require('../../lib/onDataMethod/onDataMethod');


module.exports = {
  socketServer: socketServer(address.host, address.port, onDataMethod)
};
