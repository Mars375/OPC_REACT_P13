const mongoose = require('mongoose');
const User = require('../database/models/userModel');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    return populateDatabase();
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

async function populateDatabase() {
  try {
    // Supprimez les utilisateurs existants
    await User.deleteMany({});

    // Ajoutez de nouveaux utilisateurs
    const users = [
      { firstName: 'Tony', lastName: 'Stark', email: 'tony@stark.com', password: 'password123' },
      { firstName: 'Steve', lastName: 'Rogers', email: 'steve@rogers.com', password: 'password456' },
      // Ajoutez d'autres utilisateurs ici
    ];

    await User.insertMany(users);
    console.log('Database populated');
    process.exit();
  } catch (err) {
    console.error('Error populating database', err);
    process.exit(1);
  }
}