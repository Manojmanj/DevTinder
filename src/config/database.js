const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://manoj:manoj@namastenode.yeryrsj.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
