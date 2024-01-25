const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectionToDatabase = async () => {
    try {        
        await mongoose.connect(process.env.CONNECTION_STRING, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          dbName: 'userDocs'
        });
        console.log("Database connection is ready...");
      } catch (error) {
        console.error("Database connection error:", error);
      }
};
module.exports = {
    connectionToDatabase,
}
