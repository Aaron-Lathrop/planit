const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const app = express();
const dev = app.get('env') !== 'production';

const normalizePort = port => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 5001);

// DB Connection
require('dotenv').config();
const { DB_USER, 
        DB_PASS, 
        DB_URL, 
        DB_PORT, 
        DB_NAME } = require('./config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_URL}:${DB_PORT}/${DB_NAME}`);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Production and Dev config
if(!dev) {
    app.disable('x-powered-by');
    app.use(compression());
    app.use(morgan('common'));

    app.use(express.static(path.resolve(__dirname, 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
}

if(dev) {
    app.use(morgan('dev'));
}

app.listen(PORT, err => {
    if(err) {
        throw err;
    }

    console.log('Server started');
})