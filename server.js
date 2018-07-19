'use strict';
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const uuid = require('uuid');

const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');

mongoose.Promise = global.Promise;
//enable client origin before deploying
const{PORT, DATABASE_URL, /*CLIENT_ORIGIN*/} = require('./config');

const app = express();

//logging
app.use(morgan('common'));

//enable client origin before deploying
app.use(cors());

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

//define routers here like this
app.use('/users/', usersRouter);
app.use('/auth/', authRouter);

app.use('*', (req, res) => {
	return res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, {useNewUrlParser: true}, err => {
			if(err) {
				return reject(err);
			}
			server = app.listen(port,() => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if(err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};