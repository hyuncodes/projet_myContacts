// import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

dotenv.config();

export async function connectDB() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(process.env.MONGODB_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Connecté à MongoDB Atlas");
  } catch(err) {
    console.error("Erreur de connexion:", err);
    await mongoose.disconnect();
  }
}