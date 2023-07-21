const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/url_shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

const urlSchema = new mongoose.Schema({
  destinationUrl: String,
  shortUrl: String,
  expiryDate: Date,
});

const Url = mongoose.model('Url', urlSchema);

app.use(express.json());

app.post('/shortenUrl', async (req, res) => {
  try {
    const { destinationUrl } = req.body;
    const shortCode = generateShortCode();

    const url = new Url({
      destinationUrl,
      shortUrl: shortCode,
    });

    await url.save();

    res.json({ shortUrl: shortCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/updateUrl', async (req, res) => {
  try {
    const { shortUrl, destinationUrl } = req.body;
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    url.destinationUrl = destinationUrl;
    await url.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortUrl: shortCode });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.redirect(`www.ppa.in/${shortCode}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/updateExpiry', async (req, res) => {
  try {
    const { shortUrl, daysToAdd } = req.body;
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    url.expiryDate.setDate(url.expiryDate.getDate() + daysToAdd);
    await url.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function generateShortCode() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortCode = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters[randomIndex];
  }

  return shortCode;
}

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
