const mongoose = require('mongoose');
const seedDatabase = require('../seed');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
    await seedDatabase();
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
