'use strict';

const socketServer = require('../../lib/socketServer/socketServer');
const onDataMethod = require('../../lib/onDataMethod/onDataMethod');


module.exports = {
  socketServer: socketServer(onDataMethod)
};
