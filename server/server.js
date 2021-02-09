// Require Express
const express = require('express');

// Require Apollo Server 
const { ApolloServer } = require('apollo-server-express');

// Require path
const path = require('path');

// Import DB connection
const db = require('./config/connection');

// Require routes
const routes = require('./routes');

// Declare app as instance of express
const app = express();

// Declare port for connecting to app as environment variable is present else use 3001
const PORT = process.env.PORT || 3001;

// Express middleware
// Recognize incoming request objects as strings or arrays
app.use(express.urlencoded({ extended: true }));

// Recognize incoming request objects as JSON objects
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
