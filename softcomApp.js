const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 16000;
const logger = require('morgan');
const cors = require('cors');
const Users = require('./users/user')
const Question = require('./question/question')
const { mongoURI} = require('./helpers/config')


app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors())
app.get('/', function (req, res) {
    res.status(200).json('Hello softcom')
});
app.use('/api/v1/users', Users)
app.use('/api/v1/question', Question)
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongodb is running')
    }).catch(err => {
        console.log('Error connecting to Db', err)
    })

app.listen(PORT, console.log(`Server running on ${PORT}`));
