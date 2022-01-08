// DEPENDENCIES

require('dotenv').config()
// pull PORT from .env
const {
    PORT = 3001,
    DATABASE_URL
} = process.env;
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const cors = require('cors');
const morgan = require('morgan');

// DATABASE CONNECTION

// Establish Connection
mongoose.connect(process.env.DATABASE_URL)

// Set db variable
const db = mongoose.connection;

// Connection events
db.on('error', function (err) {
    console.log(err.message + 'is mongo not running?');
})
db.on('connected', function () {
    console.log('mongo connected');
})
db.on('disconnected', function () {
    console.log('mongo disconnected');
})


// MODELS

const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model('Cheese', CheeseSchema);

// MIDDLEWARE

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());



// ROUTES

// Home
app.get('/', function (req, res) {
    res.send('hello world');
})

// Index
app.get('/cheeses', async function (req, res) {
    try {
        res.json(await Cheese.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Create
app.post('/cheeses', async function (req, res) {
    try {
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Delete

app.delete('/cheeses/:id', async function (req, res) {
    try {
        res.json(await Cheese.findByIdAndDelete(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
})

// Update

app.put('/cheeses/:id', async function (req, res) {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    } catch (error) {
        res.status(400).json(error);
    }
})

// LISTENER
app.listen(PORT, function () {
    console.log(`listening on PORT ${PORT}`)
})