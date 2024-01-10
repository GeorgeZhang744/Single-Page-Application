export class UserSavedPwd {
  constructor() {
    this.currPwdId = 1; // determine the pwdId of each password
    this.autoNameId = 1; // helps to auto generate password name when the user does not insert password name
    this.savedPwd = []; // stores the user's saved passwords
  }
}