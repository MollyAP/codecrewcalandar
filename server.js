const express = require('express');
const moment = require('moment');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

let cachedData = null;

async function fetchData() {
  try {
    const fetch = await import('node-fetch'); // Use dynamic import() here
    const response = await fetch.default('https://api.jsonbin.io/v3/b/6643705aacd3cb34a847d035/latest', {
      headers: {
        'X-Master-key': '$2a$10$jt7NCradmKBFfCDVM9gHheM5tsr7BLWgofJhxOa/fFIqbgvu2dnEO'
      }
    });
    const data = await response.json();
    cachedData = data;
    console.log('Data fetched:', cachedData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Fetch data initially
fetchData();

// Schedule data refresh every Sunday at midnight
setInterval(() => {
  const today = moment();
  if (today.day() === 0 && today.hour() === 0 && today.minute() === 0) {
    console.log('Refreshing data...');
    fetchData();
  }
}, 1000 * 60); // Check every minute for Sunday

app.get('/events', (req, res) => {
  res.json(cachedData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
