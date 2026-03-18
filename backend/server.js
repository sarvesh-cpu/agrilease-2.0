const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AgriLease API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
