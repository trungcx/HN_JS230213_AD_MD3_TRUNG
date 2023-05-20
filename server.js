const express = require("express");
const server = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const port = 3000;

// **** USE **** //
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));

// **** Path **** //
const usersPath = `${__dirname}/dev-data/users.json`;
const roundsPath = `${__dirname}/dev-data/rounds.json`;

// HOME PAGE
server.get("/", (req, res) => {
  // res.send("Home page");
  res.sendFile(`${__dirname}/public/adduser.html`);
});
// Add user page
server.get("/add-user", (req, res) => {
  // res.sendFile(`${__dirname}/public/adduser.html`);
});
server.post("/add-user", (req, res) => {
  try {
    const { namePlayer1, namePlayer2, namePlayer3, namePlayer4 } = req.body;
    const usersName = Object.values(req.body);
    const id = 100;
    let users = usersName.map((name, index) => {
      return {
        id: index + id,
        name: name,
      };
    });
    fs.writeFileSync(usersPath, JSON.stringify(users));
    res.json({
      message: "Add user succeed",
    });
  } catch (error) {
    res.json({
      message: error,
    });
  }
});
// Get users data
server.get("/users", (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersPath));
    res.json(JSON.stringify(users));
  } catch (error) {
    res.json({
      message: error,
    });
  }
});
// Get rounds data
server.get("/rounds", (req, res) => {
  try {
    const rounds = JSON.parse(fs.readFileSync(roundsPath));
    res.json(JSON.stringify(rounds));
  } catch (error) {
    res.json({
      message: error,
    });
  }
});
// Post rounds data
server.post("/rounds", (req, res) => {
  try {
    const rounds = JSON.parse(fs.readFileSync(roundsPath));
    // const rounds = fs.readFileSync(roundsPath);
    console.log("post rounds: ", rounds);
    if (rounds.length == 0) {
      rounds.push({
        id: 1,
        score: [0, 0, 0, 0],
      });
      console.log("after push:", rounds);
      fs.writeFileSync(roundsPath, JSON.stringify(rounds));
      res.json(rounds);
    } else {
      rounds.push({
        id: rounds[rounds.length - 1].id + 1,
        score: [0, 0, 0, 0],
      });
      console.log("after push:", rounds);
      fs.writeFileSync(roundsPath, JSON.stringify(rounds));
      res.json(rounds);
    }
  } catch (error) {
    res.json({
      message: error,
    });
  }
});
// Put (edit) rounds data
server.put("/rounds", (req, res) => {
  try {
    // console.log("put rounds params: ", req.query);
    const { roundIndex, userScoreIndex, value } = req.query;
    const rounds = JSON.parse(fs.readFileSync(roundsPath));

    rounds[parseInt(roundIndex)].score[parseInt(userScoreIndex)] =
      parseInt(value);
    // console.log("rounds[parseInt(roundIndex)]: ", rounds[parseInt(roundIndex)]);
    fs.writeFileSync(roundsPath, JSON.stringify(rounds));
    res.json(rounds);
  } catch (error) {
    res.json({
      message: error,
    });
  }
});
server.delete("/rounds", (req, res) => {
  try {
    const rounds = [];
    fs.writeFileSync(roundsPath, JSON.stringify(rounds));
    res.json({
      message: "delete rounds succeed",
    });
  } catch (error) {
    res.json({
      message: error,
    });
  }
});
// Round page
server.get("/round/id", (req, res) => {
  res.sendFile(`${__dirname}/public/round.html`);
});

server.listen(3000, () => {
  console.log(`server is running on http://localhost:3000`);
});
