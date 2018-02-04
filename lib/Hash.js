'use strict';


module.exports = Hash;


function Hash() {

  let self = this;

  self.keys = {};

}


Hash.prototype.get = function(keyId) {

  let self = this;

  try {
    return self.keys[connectionId];

  } catch (err) {
    console.log(err.message);
    return null;
  }
}


Hash.prototype.add = function(id, object) {

  let self = this;

  try {
    self.keys[id] = object;
    return true;

  } catch (err) {
    console.log(err.message);
    return false;
  }
}


Hash.prototype.delete = function(id) {

  let self = this;

  try {
    return delete self.keys[id];
    
  } catch (err) {
    console.log(err.message);
    return false;
  }
}
