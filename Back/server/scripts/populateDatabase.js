const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../database/models/userModel'); // Assurez-vous que le chemin est correct

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

    // Ajoutez de nouveaux utilisateurs avec des mots de passe hachés
    const users = [
      { firstName: 'Tony', lastName: 'Stark', email: 'tony@stark.com', password: await bcrypt.hash('password123', 10) },
      { firstName: 'Steve', lastName: 'Rogers', email: 'steve@rogers.com', password: await bcrypt.hash('password456', 10) },
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