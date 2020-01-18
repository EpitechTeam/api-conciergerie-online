const ObjectID = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const privateKey = "sssshhhhh";

const createToken = email => {
  return jwt.sign({ email: email }, privateKey, { expiresIn: "7d" });
};

module.exports = function(app, db) {
  app.put("/users/:id", async (req, res) => {
    try {
      let id = req.params.id;
      const details = {
        _id: new ObjectID(id)
      };

      const user = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city
      };
      if (
        user.email &&
        !user.password &&
        !user.firstName &&
        !user.lastName &&
        !user.citys
      ) {
        _email = user.email;
        let okEmail = emailValidator.validate(_email);
        if (okEmail) {
          let user1 = await db.collection("users").findOne(details);
          if (!user1) {
            res.status(500).send({ error: err.message });
          } else {
            user.email = _email;
            user.password = user1.password;
            user.firstName = user1.firstName;
            user.lastName = user1.lastName;
            user.city = user1.city;
            db.collection("users").update(details, user, (err, result) => {
              if (err) {
                res.status(500).send({
                  error: "An error has occurred during update"
                });
                console.log(err);
              } else {
                res.status(200).send(user);
              }
            });
          }
        } else {
          res.status(400).send({ error: "Bad Request" });
        }
      } else if (
        !user.email &&
        user.password &&
        !user.firstName &&
        !user.lastName &&
        !user.city
      ) {
        _password = user.password;
        let schema = new passwordValidator();
        schema
          .is()
          .min(7)
          .has()
          .uppercase()
          .is()
          .not()
          .oneOf(["Password", "123"]);
        let okPassword = schema.validate(user.password);
        if (okPassword) {
          let user1 = await db.collection("users").findOne(details);
          if (!user1) {
            res.status(500).send({
              error: "An error has occurred during update"
            });
          } else {
            bcrypt.hash(_password, 10, function(err, hash) {
              if (!err) {
                user.email = user1.email;
                user.password = hash;
                user.firstName = user1.firstName;
                user.lastName = user1.lastName;
                user.city = user1.city;
                db.collection("users").update(details, user, (err, result1) => {
                  if (err) {
                    res.status(500).send({
                      error: "An error has occurred during update"
                    });
                  } else {
                    res.status(200).send(user);
                  }
                });
              } else res.send({ error: "Error during password's encryption" });
            });
          }
        } else {
          res.status(400).send({ error: "Bad Request" });
        }
      } else if (
        !user.email &&
        !user.password &&
        user.firstName &&
        !user.lastName &&
        !user.city
      ) {
        _firstName = user.firstName;
        let user1 = await db.collection("users").findOne(details);
        if (!user1) {
          res.status(500).send({
            error: "An error has occurred during update"
          });
        } else {
          user.email = user1.email;
          user.password = user1.password;
          //user.firstName = _firstName;
          user.lastName = user1.lastName;
          user.city = user1.city;
          db.collection("users").update(details, user, (err, result) => {
            if (err) {
              res.status(500).send({
                error: "An error has occurred during update"
              });
            } else {
              res.status(200).send(user);
            }
          });
        }
      } else if (
        !user.email &&
        !user.password &&
        !user.firstName &&
        user.lastName &&
        !user.city
      ) {
        _lastName = user.lastName;
        let user1 = await db.collection("users").findOne(details);
        if (!user1) {
          res.status(500).send({
            error: "An error has occurred during update"
          });
        } else {
          user.email = user1.email;
          user.password = user1.password;
          user.firstName = user1.firstName;
          user.city = user1.city;
          db.collection("users").update(details, user, (err, result) => {
            if (err) {
              res.status(500).send({
                error: "An error has occurred during update"
              });
            } else {
              res.status(200).send(user);
            }
          });
        }
      } else if (
        !user.email &&
        !user.password &&
        !user.firstName &&
        !user.lastName &&
        user.city
      ) {
        _city = user.city;
        let user1 = await db.collection("users").findOne(details);
        if (!user1) {
          res.status(500).send({
            error: "An error has occurred during update"
          });
        } else {
          user.email = user1.email;
          user.password = user1.password;
          user.firstName = user1.firstName;
          user.lastName = user1.lastName;
          db.collection("users").update(details, user, (err, result) => {
            if (err) {
              res.status(500).send({
                error: "An error has occurred during update"
              });
            } else {
              res.status(200).send(user);
            }
          });
        }
      } else if (
        user.email &&
        user.password &&
        user.firstName &&
        user.lastName &&
        user.city
      ) {
        let schema = new passwordValidator();
        schema
          .is()
          .min(7)
          .has()
          .uppercase()
          .is()
          .not()
          .oneOf(["Password", "123"]);
        let okPassword = schema.validate(user.password);
        let okEmail = emailValidator.validate(user.email);
        if (okPassword && okEmail) {
          let user1 = await db.collection("users").findOne(details);
          if (!user1) {
            res.status(400).send({
              error: "Nothing to update at that ID"
            });
          } else {
            bcrypt.hash(user.password, 10, (err, hash) => {
              user.password = hash;
              db.collection("users").update(details, user, (err, result) => {
                if (err) {
                  res.status(500).send({
                    error: "An error has occurred during update"
                  });
                } else {
                  res.status(200).send(user);
                }
              });
            });
          }
        } else {
          res.status(400).send({ error: "Bad Request" });
        }
      } else if (
        !user.email ||
        !user.password ||
        !user.firstName ||
        !user.lastName ||
        !user.city
      ) {
        res.status(400).send({ error: "Bad Request :'(" });
      }
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/register_owner", (req, res, next) => {
    let schema = new passwordValidator();
    schema
      .is()
      .min(7)
      .has()
      .uppercase()
      .is()
      .not()
      .oneOf(["Password", "123"]);
    const info = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      city: req.body.city,
      isOwner: true
    };
    let okPassword = schema.validate(info.password);
    if (!okPassword || !info.password) {
      return res.status(400).send({ error: "Bad request" });
    }
    let okEmail = emailValidator.validate(info.email);
    if (
      !info.email ||
      !info.firstName ||
      !info.lastName ||
      !info.city ||
      !okEmail
    ) {
      return res.status(400).send({ error: "Bad request" });
    }
    bcrypt.hash(info.password, 10, function(err, hash) {
      info.password = hash;
      db.collection("users").insertOne(info, (err, result) => {
        if (err) {
          res.status(422).send({
            error: "Unprocessable Entity"
          });
        } else {
          res.status(200).send(result.ops[0]);
          console.log(result.ops[0]._id);
        }
      });
    });
  });

  app.post("/register_freelance", (req, res, next) => {
    let schema = new passwordValidator();
    schema
      .is()
      .min(7)
      .has()
      .uppercase()
      .is()
      .not()
      .oneOf(["Password", "123"]);
    const info = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      city: req.body.city,
      isFreelance: true
    };
    let okPassword = schema.validate(info.password);
    if (
      !info.email ||
      !info.password ||
      !info.firstName ||
      !info.lastName ||
      !info.city ||
      !okPassword
    ) {
      return res.status(400).send({ error: "Bad request" });
    }
    bcrypt.hash(info.password, 10, function(err, hash) {
      info.password = hash;
      db.collection("users").insertOne(info, (err, result) => {
        if (err) {
          res.status(422).send({
            error: "Unprocessable Entity"
          });
        } else {
          res.status(200).send(result.ops[0]);
          console.log(result.ops[0]._id);
        }
      });
    });
  });

  app.post("/login", async (req, res, next) => {
    const info = {
      email: req.body.email,
      password: req.body.password
    };
    if (!info.email || !info.password) {
      return res.status(422).send({ error: "Unprocessable Entity" });
    } else {
      const user = await db.collection("users").findOne({ email: info.email });
      console.log(user);
      if (user) {
        bcrypt.compare(info.password, user.password, function(err, result) {
          if (result) {
            const token = createToken(info.email);
            res.status(200).send({ token: token });
          } else {
            res.status(422).send({ error: "Unprocessable Entity :'(" });
          }
        });
      } else res.status(403).send({ error: "user email invalid" });
    }
  });

  app.get("/admin/:email_of_user", async (req, res) => {
    try {
      const email = req.params.email_of_user;
      const token = req.headers.token;
      let decoded = jwt.verify(token, privateKey);
      const admin = await db
        .collection("users")
        .findOne({ email: decoded.email });
      if ("isAdmin" in admin) {
        // do stuff like retrieve info on user and then update
        const user = await db.collection("users").findOne({ email: email });
        res.send(user);
      } else {
        res.status(403).send({ error: "Forbidden" });
      }
    } catch (err) {
      console.log(err);
    }
  });
  
  app.post("/forgot", async (req, res) => {
    const user = {
      email: req.body.email,
      resetPasswordtoken: ""
      //resetPasswordExpires: 0
    };
    let user1 = await db.collection("users").findOne({ email: user.email });
    if (!user1) {
      res.status(400).send({ error: "Bad Request" });
    } else {
      const token = createToken(user.email);
      db.collection("users").update(
        { email: user.email },
        { $set: { tokenPasswordReset: token } },
        async (err, result) => {
          let user1 = await db
            .collection("users")
            .findOne({ email: user.email });
          //res.status(200).send({ success: "token reset password added" });
          res.status(200).send({ user1 });
        }
      );

      let smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: { user: "eip.v3.0@gmail.com", pass: "bonjoureipv3" }
      });
      let mailOptions = {
        to: user.email,
        from: "eip.v3.0@gmail.com",
        subject: "bonjoureipv3",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          "http://" +
          req.headers.host +
          "/reset/" +
          token +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n"
      };
      smtpTransport.sendMail(mailOptions, function(err, result) {
        if (!err) {
          console.log("in forgot SUCESS");
          //res.status(200).send({ sucess: "email send to " + user.email });
        } else {
          console.log("in forgot ERR");
        }
      });
    }
  });

  app.post("/reset/:token", async (req, res) => {
    const user = {
      password: req.body.password,
      tokenPasswordReset: ""
    };
    let decoded = jwt.verify(req.params.token, privateKey);
    let _email = decoded.email;
    let schema = new passwordValidator();
    schema
      .is()
      .min(7)
      .has()
      .uppercase()
      .is()
      .not()
      .oneOf(["Password", "123"]);
    let okPassword = schema.validate(user.password);
    if (okPassword) {
      let user1 = await db
        .collection("users")
        .findOne({ tokenPasswordReset: req.params.token });
      if (!user1) {
        res.status(400).send({ error: "Bad token" });
      } else {
        bcrypt.hash(user.password, 10, function(err, hash) {
          db.collection("users").update(
            { tokenPasswordReset: req.params.token },
            {
              $set: {
                password: hash,
                tokenPasswordReset: ""
              }
            }
          );
        });
        let smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: { user: "eip.v3.0@gmail.com", pass: "bonjoureipv3" }
        });
        let mailOptions = {
          to: _email,
          from: "eip.v3.0@gmail.com",
          subject: "Password Reset eipv3",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            _email +
            " has just been changed.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err, result) {
          if (!err) {
            console.log("in RESET sucess");
            res.status(200).send(result);
          } else {
            console.log("in RESET err");
          }
        });
      }
    } else {
      res.status(400).send({ error: "Password doesn't match schema'" });
    }
  });
};
