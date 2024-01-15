if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Add Express
const express = require('express');
const app = express();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const secret = 'fbsubjiwqij';
const cors = require('cors');

// DB
const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL); 
mongoose.connection.on('open', () => {
  console.log('database connection succeeded');
})
mongoose.connection.on('error', () => {
  console.log('database connection failed');
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});
const userModel = mongoose.model("user", userSchema, "users");

const dashboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: Map,
    required: true
  }
});
const dashboardModel = mongoose.model("dashboard", dashboardSchema, "dashboard");


// middleman
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.get('/', (req, res) => {
  res.send('Express on Vercel');
  // userModel.find().then(data => {
  //   console.log(data);
  // })
});


app.get('/center', (req, res) => {
  res.send('this is my center route');
});


app.get('/api/dashboard/:name', (req, res) => {
  // console.log(req.params);
  dashboardModel.findOne({name: req.params.name}).then(data => {
    console.log(data);
    res.json({
      code: 1,
      message: 'fetched data successfully',
      data: data
    });
  }).catch(err => {
    console.log(err);
    res.json({
      code: 0,
      message: 'fetching data failed',
      data: err
    });
  })
});

const passCrypt = (req, res, next) => {
  const password = req.body.password;
  req.body.password = md5(md5(password).slice(4, 14) + password);
  next()
}

app.post('/api/register', passCrypt, (req, res) => {
  console.log(req.body);
  userModel.create(req.body).then(data => {
    console.log('a user was registered successfully ');
    res.json({
      code: 1,
      message: 'registered successfully',
      data: data
    });
  }).catch(err => {
    console.log(err);
    res.json({
      code: 0,
      message: 'registration failed',
      data: err
    });
  })
});

app.post('/api/login', passCrypt, (req, res) => {
  console.log(req.body);
  userModel.findOne(req.body).then(data => {
    if (data) {
      res.send({
        code: 1,
        message: 'logged in successfully',
        token: jwt.sign({ uid: data._id, exp: Math.ceil(Date.now() / 1000) + 7200 }, secret)
      })
    } else {
      res.send({
        code: 0,
        message: 'login failed'
      })
    }
  }).catch(err => {
    console.log(err);
    res.json({
      code: 0,
      message: 'login failed',
      data: err
    });
  })
});



// Initialize server
app.listen(8080, () => {
  console.log('Server running on port 8080.');
});

module.exports = app;