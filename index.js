


//node packages
const express = require("express");
const handlebars = require("express-handlebars");
const basicAuth = require("express-basic-auth");
const bodyParser = require("body-parser");

// Set up express and environment
const app = express();
require("dotenv").config();
const config = require("./config.json")[process.env.NODE_ENV || "development"];

//User Set up
const AuthChallenger = require("./AuthChallenger");
const NoteService = require("./Service/NoteService");
const NoteRouter = require("./Router/NoteRouter");

//knex set up
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

//handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//middlewear
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  basicAuth({
    authorizeAsync: true,
    authorizer: AuthChallenger(knex),
    challenge: true,
    realm: "Taking Notes",
  })
);


const noteService = new NoteService(knex);
app.get("/", (req, res) => {
  res.render("index", {
    user: req.auth.user,
  });
});









// Set up routes to /api/notes
app.use("/api/notes/", new NoteRouter(noteService).router());

app.listen(config.port, () =>
  console.log(`Note Taking app listening to ${config.port}!`)
);

module.exports.app = app;









// // Require all of the libraries needed

// // In-built Node Modules
// const fs = require("fs");
// const path = require("path");

// // NPM installed modules
// const bodyParser = require("body-parser");
// const basicAuth = require("express-basic-auth");
// const handlebars = require("express-handlebars");

// const express = require("express");
// const app = express();
// require("dotenv").config();
// const config = require("./config.json")[process.env.NODE_ENV || "development"];
// //set up postgres and knex database
// const knexConfig = require("./knexfile").development;
// const knex = require("knex")(knexConfig);

// // Get all user generated modules into the application

// const config = require("./stores/config.json")["development"]; // We use all the development paths
// const AuthChallenger = require("./AuthChallenger");
// const NoteService = require("./Service/NoteService");
// const NoteRouter = require("./Router/NoteRouter");

// // Set up handlebars as our view engine - handlebars will responsible for rendering our HTML
// app.engine("handlebars", handlebars({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// console.log(`View Engine is: ${app.get("view engine")} `);
// // Serves the public directory to the root of our server
// app.use(express.static("public"));

// // Set up middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// // most recent version of Express => app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.json());

// // Set up basic auth
// app.use(
//   basicAuth({
//     authorizeAsync: true,
//     authorizer: AuthChallenger(knex),
//     challenge: true,
//     realm: "Note Taking app",
//   })
// );

// // Create a new instance of noteService and pass the file path/to/the/file where you want the service to read from and write to.
// const noteService = new NoteService(knex);
// app.get("/", (req, res) => {
//   res.render("index", {
//     user: req.auth.user,
//   });
// });
// // Responsible for sending our index page back to our user.
// // app.get("/", (req, res) => {
// //   console.log(req.auth.user, req.auth.password);
// //   noteService.list(req.auth.user).then((data) => {
// //     console.log(data);
// //     res.render("index", {
// //       user: req.auth.user,
// //       notes: data,
// //     });
// //   });
// // });

// // Set up the NoteRouter - handle the requests and responses in the note, read from a file and return the actual data, get the note from your JSON file and return to the clients browser.
// app.use("/api/info", new NoteRouter(noteService).router()); //sending our data

// // Set up the port that we are going to run the application on, therefore the port that we can view the application from our browser.
// app.listen(config.port, () =>
//   console.log(`Note Taking application listening to port ${config.port}`)
// );

// module.exports = app;
