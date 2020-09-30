const express = require('express');
const sha256 = require('sha256');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || "80";

const config_path = path.join(__dirname + '/config.json');
const config = JSON.parse(fs.readFileSync(config_path));
let logged_in = {};

app.use(bodyParser.json());

app.post('/auth', (req, res) => {
  if (req.body.login in config.users){
    if (req.body.login in logged_in){
      if (logged_in[req.body.login] === req.connection.remoteAddress){
        res.send("Already logged in!");
      } else {
        res.send("User connected from another ip!")
      }
    } else{
      if (req.body.password === config.users[req.body.login]){
        // let current_date = (new Date()).valueOf().toString();
        // let random = Math.random().toString();
        // let cookie = crypto.createHash('sha1').update(current_date + random).digest('hex');
        logged_in[req.body.login] = req.connection.remoteAddress;
        res.send("Logged in!");
      } else {
        res.sendStatus(403);
      }
    }
  } else {
    res.sendStatus(403);
  }
});

app.get('/userstatus', (req, res) => {
  if(req.query.login in config.users){
    if (req.query.login in logged_in){
      res.send(`User ${req.query.login} is logged in from ${logged_in[req.query.login]}`);
    } else {
      res.send(`User ${req.query.login} is not logged in`);
    }
  } else {
    res.send(`User ${req.query.login} doesn't exitst!`);
  }
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
