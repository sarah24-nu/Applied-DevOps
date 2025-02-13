const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// MongoDB Atlas URI (from your provided connection string)
const mongoURI = "mongodb+srv://f219402:muhiman72724@newcluster.fysrvgs.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error: ", err));

// Define a simple Item schema and model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Item = mongoose.model('Item', itemSchema);

// Basic CRUD operations

// 1. Create an item (POST /items)
app.post('/items', async (req, res) => {
  const { name } = req.body;

  try {
    const newItem = new Item({ name });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// 2. Get all items (GET /items)
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// 3. Update an item (PUT /items/:id)
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// 4. Delete an item (DELETE /items/:id)
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

