// Require Express
const express = require('express');

// Require Apollo Server
const {ApolloServer} = require('apollo-server-express');

// Require path
const path = require('path');

// Require Authentication middleware - jwt
const {jwtAuth} = require('./utils/auth');

// Import DB connection
const db = require('./config/connection');

// Declare port for connecting to app as environment variable is present else use 3001
const PORT = process.env.PORT || 3001;

// Declare app as instance of express
const app = express();

// Declare new instance of apollo-server for use by application
const server = new ApolloServer({typeDefs, resolvers, context: jwtAuth});

// Apply apollow middleware to app
server.applyMiddleware({app});


// Express middleware
// Recognize incoming request objects as strings or arrays
app.use(express.urlencoded({extended: false}));

// Recognize incoming request objects as JSON objects
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// For all URLs requested, send the index.html file from client/build
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
});

db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
