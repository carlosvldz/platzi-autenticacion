const express = require('express');
const jwt = require("jsonwebtoken");
const { config } = require("./config");

//Initializing app
const app = express();

//Middlewares
app.use(express.json());

app.post("/api/auth/token", function(req, res) {
    //Token sign
    const { email, username, name } = req.body;
    const token = jwt.sign({ sub: username, email, name }, config.authJwtSecret);
    res.json({ access_token: token });
});

const server = app.listen(5000, function() {
    console.log(`Listening http://localhost:${server.address().port}`);
});