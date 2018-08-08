'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const uuid = require('uuid');

const {User} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// Define endpoints for post (graphql)

module.exports = {router};
