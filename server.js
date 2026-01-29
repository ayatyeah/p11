const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const Item = mongoose.model('Item', new mongoose.Schema({
    name: String,
    price: Number
}));

app.get('/', (req, res) => {
    res.json({ message: "API is running" });
});

app.get('/api/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.get('/api/items/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.json(item);
});

app.post('/api/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
});

app.put('/api/items/:id', async (req, res) => {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

app.delete('/api/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});