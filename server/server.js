require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');


//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));


//parse json file
app.use(bodyParser.json());

//global config of routes
app.use(require('./routes/index'));






mongoose.connect('mongodb://localhost:27017/cafe',{useNewUrlParser: true, useUnifiedTopology: true},(err, res)=> {
    if(err) throw new err;

    console.log('database online');


});

app.listen(process.env.PORT, ()=> {
    console.log('listen on port', process.env.PORT);
})