const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const dbConnection = () => {
  mongoose.connect(process.env.CONNECTION_STRING).then((conn) => {
    console.log(`database connected: ${conn.connection.host}`);
  });
};

module.exports = dbConnection;
