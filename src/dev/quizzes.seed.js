import mongoose from "mongoose";
import { config } from "dotenv";
import Quizz from '../models/quizz.model.js';
import economyQuizzes from "../../otros/quizzes/economy-quizzes.json" assert { type: 'json' };

config();

try {
    await mongoose.connect(process.env.MONGO_URI, {});
    await Quizz.deleteMany({});
    await Quizz.insertMany(economyQuizzes);

    console.log('Quizzes de Economía insertados en MongoDB');
}
catch (e) {
    console.log('We have an error');
    console.error(e.message);
}
finally {
    mongoose.connection.close();
}