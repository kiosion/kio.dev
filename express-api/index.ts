// Imports
import express from 'express';

const port: number = 4000;

// Import functions from lib
import SanityFetch from './lib/fetch';

// Express
const app = express();

// Routes
// Default route, or when missing auth token
app.get('/(*)', (req, res) => {
  res.send(
    `<center><h2>⛔ Go away! Nothing to see here</h2></center>`
    + `<br /><center><p>Requested: ${req.path}</p></center>`
  );
});

// TODO: Add routes

// Routes for: 
// - fetching all posts (count)
// - fetching range of posts (x to y)
// - fetching post by slug or id

// - fetching all tags
// - fetching all posts by tag (count)
// - fetching range of posts by tag (x to y)

// - fetching all projects (count)
// - fetching range of projects (x to y)
// - fetching project by slug or id

// - running custom queries (requiring auth token), + limited scope

// Listen on port
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
