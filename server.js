const express = require('express');
const sha256 = require('sha256');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const redis = require('redis');

const app = express();
const port = process.env.PORT || "80";

app.get('/authorize', (req, res) => {

});
