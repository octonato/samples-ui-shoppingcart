const express = require("express");
const app = express();
const server = require("http").createServer(app);
const fs = require('fs');

app.use("/", express.static("public"));

server.listen(3000);
console.log("Http Servee running on " + server.address().address + ":" + server.address().port);

let indexPage = Buffer.from("");
fs.readFile('./public/index.html', function(err, data) {
  console.log("data", data.length);
  indexPage = data;
});
