const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const homeRouter = require('./routes/home');
const recipeRouter = require('./routes/recipe'); //   

app.use('/homeRouter', homeRouter);
app.use('/recipeRouter', recipeRouter); //   

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});