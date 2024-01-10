import { MongoClient, ServerApiVersion } from "mongodb";
import { UserSavedPwd } from "./userSavedPwd.js";
import * as dbUtils from "./databaseUtils.js";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;

class Database {
  constructor(dburi) {
    this.dburi = dburi; // database url
    this.usersCollection = null; // a collection in the database that stores the users' login information and their saved passwords
  }

  // make connection to the database
  async connect() {
    this.client = new MongoClient(this.dburi);

    try {
      await this.client.connect();
      this.db = this.client.db();
      await this.init();
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }

  // initialize the user collection that will be used in other methods
  async init() {
    this.usersCollection = this.db.collection("users");
    const count = await this.usersCollection.countDocuments();
    if (count === 0) {
      await this.usersCollection.insertOne({ _id: "-1" });
    }
  }

  // disconnection from the database
  async close() {
    this.client.close();
  }

  // create a new user account in user collection of the database
  async createUserAccount(username, loginPwd) {
    // missing required username and login password
    if (!username || !loginPwd) {
      return -2;
    }

    // check if the username has already been used
    const searchingResult = await this.usersCollection.findOne({ username: username });
    if (searchingResult) {
      return -1; // username already exists
    } else {
      // create a new object in the user collection that has the new user's username, login password, and a UserAccount
      // object that stores the user's saved passwords
      this.usersCollection.insertOne({
        username: username,
        loginPwd: loginPwd,
        userPwdInfo: new UserSavedPwd(),
      });
    }
  }

  // retrieve the information of the user that matches the input username and login password in the user collection
  async loginAccount(username, loginPwd) {
    const searchingResult = await this.usersCollection.findOne({ username: username, loginPwd: loginPwd });
    if (!searchingResult) {
      return -1; // doesn't find matched account
    } else {
      return searchingResult;
    }
  }

  // save input password and password name in the input user's account in the user collection
  async savePwd(username, pwd, pwdName) {
    const searchingResult = await this.usersCollection.findOne({ username: username });
    if (!searchingResult) {
      return -1; // does not find the account of the input user
    } else {
      dbUtils.savePwd(searchingResult.userPwdInfo, pwd, pwdName);
      await this._saveUpdatedState(username, searchingResult);
    }
  }

  // find the input user's account in the user collection. With in the account, update the password that has the same pwdId as
  // the input pwdId to the input new password and new password name
  async updatePwd(username, pwdId, newPwd, newPwdName) {
    const searchingResult = await this.usersCollection.findOne({ username: username });
    if (!searchingResult) {
      return -1; // does not find the account of the input user
    } else {
      if (dbUtils.updatePwd(searchingResult.userPwdInfo, parseInt(pwdId), newPwd, newPwdName)) {
        await this._saveUpdatedState(username, searchingResult);
      } else {
        return -2; // does not find matched pwdId
      }
    }
  }

  // get the password that has the same given pwdId in the user account that matches the given username
  async getPwd(username, pwdId) {
    const searchingResult = await this.usersCollection.findOne({ username: username });
    if (!searchingResult) {
      return -1; // does not find the account of the input user
    } else {
      const result = dbUtils.getPwd(searchingResult.userPwdInfo, parseInt(pwdId));
      return !result ? -2 : result; // return -2 if a matched pwdId is not found
    }
  }

  // delete the password that has the same given pwdId in the user account that matches the given username
  async deletePwd(username, pwdId) {
    const searchingResult = await this.usersCollection.findOne({ username: username });
    if (!searchingResult) {
      return -1; // does not find the account of the input user
    } else {
      if (dbUtils.deletePwd(searchingResult.userPwdInfo, parseInt(pwdId))) {
        await this._saveUpdatedState(username, searchingResult);
      } else {
        return -2; // return -2 if a matched pwdId is not found
      }
    }
  }

  // retrieve all of the passwords that are saved in the user account of the input user
  async getAllPwd(username) {
    const searchingResult = await this.usersCollection.findOne({ username: username });
    if (!searchingResult) {
      return -1;
    } else {
      return searchingResult.userPwdInfo;
    }
  }

  async _saveUpdatedState(username, newState) {
    this.usersCollection.updateOne({ username: username }, { $set: newState });
  }
}

const database = new Database(uri);

export { database };
