const mongoose = require("mongoose");
require("dotenv").config();

const Movie = require("./models/Movie");

const moviesData = require("./data/movies");

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.26zhx4l.mongodb.net/${process.env.DB_NAME}`;

const seed = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Mongodb Connected successfully");

        console.log("Clearing old data....");
        await Movie.deleteMany({});
        
        const moviesWithoutOldIds = moviesData.map(({ id, ...rest}) => rest);
        const insertMovies = await Movie.insertMany(moviesWithoutOldIds);
        console.log("Movies inserted successfully");
       
    } catch (error) {
        console.error("Seed failed: ", error.message);
        process.exit(1);
    }finally {
        await mongoose.disconnect();
        process.exit(0)
    }
}

seed();