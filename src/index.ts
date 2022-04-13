// Imports
import express from 'express';
import path from 'path';

// Express
const app = express();
app.set('view engine', 'ejs');

// Set static routes
app.use(express.static('public'));
//app.use('/ico', express.static('public/img/ico'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
	// Serve index.ejs
	res.render('index');
});

// Listen
app.listen(3096);
console.log('Listening on port 3096');
