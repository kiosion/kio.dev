// Imports
import express from 'express';
import fetch from 'node-fetch';

const port: number = 4000;

// Express
const app = express();

// Routes
app.get('/(*)', (req, res) => {
  res.send('Go away! Nothing to see here');
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

// Listen on port
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
