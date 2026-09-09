const mongoose = require("mongoose");

const mainDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = mainDB;