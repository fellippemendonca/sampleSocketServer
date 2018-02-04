'use strict';

module.exports = Hash;


function Hash() {
  this.keys = {};
}


Hash.prototype.getKeys = function() {

  try {
    return this.keys;

  } catch (err) {
    console.log(err.message);
    return null;
  }
}


Hash.prototype.get = function(id) {

  try {
    return this.keys[id];

  } catch (err) {
    console.log(err.message);
    return null;
  }
}


Hash.prototype.add = function(id, object) {

  try {
    this.keys[id] = object;
    return true;

  } catch (err) {
    console.log(err.message);
    return false;
  }
}


Hash.prototype.delete = function(id) {

  try {
    return delete this.keys[id];
    
  } catch (err) {
    console.log(err.message);
    return false;
  }
}
