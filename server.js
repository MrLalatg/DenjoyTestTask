const express = require('express');
const sha256 = require('sha256');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || "80";

const config_path = path.join(__dirname + '/config.json');
const config = JSON.parse(fs.readFileSync(config_path));
let logged_in = {};

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/auth', (req, res) => {
  let login_successful = false;
  if (req.body.login in config.users){
    if (req.headers.cookie in logged_in){
      if (logged_in[req.headers.cookie] === req.body.login){
        login_successful = true;
        res.send("Already logged in!");
      } else {
        delete logged_in[req.headers.cookie];
      }
    }
    if (!login_successful){
      if (req.body.password === config.users[req.body.login]){
        let current_date = (new Date()).valueOf().toString();
        let random = Math.random().toString();
        let cookie = crypto.createHash('sha1').update(current_date + random).digest('hex');
        logged_in[cookie] = req.body.login;
        res.cookie('token', cookie);
        res.sendStatus(200);
      } else {
        res.sendStatus(403);
      }
    }
  } else {
    res.sendStatus(403);
  }
});

app.get('/userstatus', (req, res) => {
  if (req.cookies.token in logged_in){
    res.send(`Logged in as ${logged_in[req.cookies.token]}`);
  } else {
    res.send("You're not logged in!");
  }
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
