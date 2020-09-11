//Set a random temporary state to prevent crawlscripting attacks
const generateRandomString = function(length) {
    let randomString = '';
    const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        randomString += possibleChars.chartAt(
            Math.floor(Math.random() * possibleChars.length)
            );
        }
    return randomString;
};

module.exports = generateRandomString;