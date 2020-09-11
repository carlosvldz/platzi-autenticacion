//Encode usernmae and password in base64
function encodeBasic(usernmae, password) {
    return Buffer.from(`${usernmae}:${password}`).toString("base64");

    module.exports = encodeBasic;
}