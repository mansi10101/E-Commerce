require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

//express app
const app = express();
app.use(express.json()); //necessary for post and patch where we are requesting data
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use('/api', routes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`Connected to db & Listening at port ${process.env.PORT}...`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
