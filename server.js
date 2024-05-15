const express = require('express');
const moment = require('moment');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

let cachedData = null;

function fetchData() {
  import('node-fetch').then(fetch => {
  fetch('https://api.jsonbin.io/v3/b/6643705aacd3cb34a847d035/latest', {
    headers: {
      'X-Master-key': '$2a$10$jt7NCradmKBFfCDVM9gHheM5tsr7BLWgofJhxOa/fFIqbgvu2dnEO'
    }
  })
  .then(response => response.json())
  .then(data => {
    cachedData = data;
    console.log('Data fetched:', cachedData);
  })
  .catch(error => console.error('Error fetching data:', error));
}).catch(err => {
  // Handle error if dynamic import fails
  console.error('Error importing node-fetch:', err);
});
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
