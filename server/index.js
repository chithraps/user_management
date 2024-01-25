const { connectionToDatabase } = require("./script");
//----------------------------------------

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
const path = require('path');
const userRoutes = require("./routes/userRoutes");
const adminRout = require("./routes/adminRoutes")
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
//middlewares
app.use(express.json());
app.use(cors());

//Connection To Database
connectionToDatabase();

//routes
app.use('/admin',adminRout)
app.use('/',userRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
