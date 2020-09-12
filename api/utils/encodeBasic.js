//Encode usernmae and password in base64
function encodeBasic(username, password) {
    return Buffer.from(`${username}:${password}`).toString("base64");
  }
  
  module.exports = encodeBasic;