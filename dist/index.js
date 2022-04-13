"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const express_1 = __importDefault(require("express"));
// Express
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
// Set static routes
app.use(express_1.default.static('public'));
//app.use('/ico', express.static('public/img/ico'));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.get('/', (req, res) => {
    // Serve index.ejs
    res.render('index');
});
// Listen
app.listen(3096);
console.log('Listening on port 3096');
