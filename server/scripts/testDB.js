const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  const testUser = await User.create({
    name: 'Test User',
    email: 'test@clearclause.dev',
    password: 'testpassword123',
  });

  console.log('User created:', testUser.toSafeObject());

  const found = await User.findOne({ email: 'test@clearclause.dev' });
  const passwordMatches = await found.matchPassword('testpassword123');
  console.log('Password match test:', passwordMatches); // should be true

  await User.deleteOne({ email: 'test@clearclause.dev' });
  console.log('Test user cleaned up');

  await mongoose.disconnect();
  console.log('Done');
};

run().catch(console.error);