// async function connectDB() {}

const mongoose = require("mongoose");

const connectDB = async () => {
 const DB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-seqdb3d-shard-00-00.ni4uwnh.mongodb.net:27017,ac-seqdb3d-shard-00-01.ni4uwnh.mongodb.net:27017,ac-seqdb3d-shard-00-02.ni4uwnh.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-c7z9ld-shard-0&authSource=admin&appName=Cluster0`;

// const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ni4uwnh.mongodb.net/${process.env.DB_NAME}?appName=Cluster0`;


  
  if (!DB_URI) {
    console.error("Missing env configuration");
    process.exit(1);
  }


  try {
    await mongoose.connect(DB_URI);
    console.log("💥 Mongodb connected successfully 💥");
  } catch (error) {
    console.error("Mongodb connection falied 😞", error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 
