const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const db = require("./config/db");

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
try {
  MongoClient.connect(
    db.url,
    { useUnifiedTopology: true },
    { useNewUrlParser: true },
    (err, database) => {
      if (err) return console.log(err);

      // THIS THE DATABASE NAME AND NOT THE COLLECTION/TABLE NAME
      database = database.db("eip-v3");

      //require('./routes/index')(app, database)

      /*app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });*/
      require("./routes/users")(app, database);
      app.listen(8000, () => {
        console.log("We are live on localhost:8000");
      });

      process.on("SIGINT", function() {
        console.log("Caught interrupt signal");
        process.exit();
      });
    }
  );
} catch (error) {
  console.log(error);
}
