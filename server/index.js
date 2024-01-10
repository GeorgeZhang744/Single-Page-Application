import express from "express";
import logger from "morgan";
import { database } from "./database.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use("/", express.static("client"));

// connect the database
await database.connect();

// handle the POST request to the "createAccount" route
app.post("/createAccount", async (request, response) => {
  const options = request.query;
  const result = await database.createUserAccount(options.username, options.loginPwd);
  if (result === -1) {
    response.status(400).json({ error: "Username already exists" });
  } else if (result === -2) {
    response.status(400).json({ error: "Missing username or password" });
  } else {
    response.status(200).json({ status: "Account created" });
  }
});

// handle the GET request to the "loginAccount" route
app.get("/loginAccount", async (request, response) => {
  const options = request.query;
  const result = await database.loginAccount(options.username, options.loginPwd);
  if (result === -1) {
    response.status(400).json({ error: "Username and password don't match" });
  } else {
    response.status(200).json(result);
  }
});

// handle the POST request to the "savePassword" route
app.post("/savePassword", async (request, response) => {
  const options = request.query;
  const result = await database.savePwd(options.username, options.pwd, options.pwdName);
  if (result === -1) {
    response.status(400).json({ error: "User does not exist" });
  } else {
    response.status(200).json({ status: "Password saved" });
  }
});

// handle the PUT request to the "updatePassword" route
app.put("/updatePassword", async (request, response) => {
  const options = request.query;
  const result = await database.updatePwd(options.username, options.pwdId, options.newPwd, options.newPwdName);
  if (result === -1) {
    response.status(400).json({ error: "User does not exist" });
  } else if (result === -2) {
    response.status(400).json({ error: "Unable to find matched password Id" });
  } else {
    response.status(200).json({ status: "Password updated" });
  }
});

// handle the GET request to the "getPassword" route
app.get("/getPassword", async (request, response) => {
  const options = request.query;
  const result = await database.getPwd(options.username, options.pwdId);
  if (result === -1) {
    response.status(400).json({ error: "User does not exist" });
  } else if (result === -2) {
    response.status(400).json({ error: "Unable to find matched password Id" });
  } else {
    response.status(200).json(result);
  }
});

// handle the DELETE request to the "deletePassword" route
app.delete("/deletePassword", async (request, response) => {
  const options = request.query;
  const result = await database.deletePwd(options.username, options.pwdId);
  if (result === -1) {
    response.status(400).json({ error: "User does not exist" });
  } else if (result === -2) {
    response.status(400).json({ error: "Unable to find matched password Id" });
  } else {
    response.status(200).json({ status: "Password deleted" });
  }
});

// handle the GET request to the "getAllPasswords" route
app.get("/getAllPasswords", async (request, response) => {
  const options = request.query;
  const result = await database.getAllPwd(options.username);
  if (result === -1) {
    response.status(400).json({ error: "User does not exist" });
  } else {
  response.status(200).json(result);
  }
});

// This matches all routes that are not defined.
app.all("*", async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
