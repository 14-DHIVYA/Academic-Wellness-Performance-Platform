const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/').then(async () => {
  const user = await User.findOne({email: 'admin@school.edu'});
  console.log(user);
  process.exit();
}).catch(console.error);
