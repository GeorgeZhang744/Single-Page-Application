// save the given password and password name into "userPwdInfo"
function savePwd(userPwdInfo, pwd, pwdName) {
  // if the user did not specify a password name, using the "autoNameId" to auto generate a name for the given password
  if (!pwdName) {
    pwdName = "Password " + userPwdInfo.autoNameId++;
  }

  // construct an object to store the info (pwdId, pwd, and pwdName) of the given password, then save it into "userPwdInfo".
  userPwdInfo.savedPwd.push({ pwdId: userPwdInfo.currPwdId++, pwdName: pwdName, pwd: pwd });
}

// use the given new password and new password name to update the password in "userPwdInfo" that has the same 
// pwdId as the given one
function updatePwd(userPwdInfo, pwdId, newPwd, newPwdName) {
  // check if there is a password with a pwdId equal to the given one, if so, update it with the given new password and 
  // new password name. Otherwise return false
  return userPwdInfo.savedPwd.some((pwdObj) => {
    if (pwdObj.pwdId === pwdId) {
      pwdObj.pwdName = !newPwdName ? pwdObj.pwdName : newPwdName;
      pwdObj.pwd = !newPwd ? pwdObj.pwd : newPwd;
      return true;
    }
    return false;
  })
}

// find and return the password stores in the "userPwdInfo" that has the same pwdId as the given one
function getPwd(userPwdInfo, pwdId) {
  let pwdInfo;
  // check if such password exists
  const found = userPwdInfo.savedPwd.some((pwdObj) => {
    if (pwdObj.pwdId === pwdId) {
      pwdInfo = pwdObj;
      return true;
    }
    return false;
  });

  // if it is found, return it
  if (found) {
    return pwdInfo;
  }

  // otherwise return false
  return false;
}

// delete the password stores in the "userPwdInfo" that has the same pwdId as the given one
function deletePwd(userPwdInfo, pwdId) {
  let i;
  let found = false;
  // check if such password exists, remove it if it is found
  for (i = 0; i < userPwdInfo.savedPwd.length; i++) {
    if (userPwdInfo.savedPwd[i].pwdId === pwdId) {
      userPwdInfo.savedPwd.splice(i, 1);
      found = true;
      break;
    }
  }

  // if it is not found, return false
  if (!found) {
    return false;
  }

  // decrement the pwdId of the passwords that come after the one that is deleted by 1
  for (let j = i; j < userPwdInfo.savedPwd.length; j++) {
    userPwdInfo.savedPwd[j].pwdId--;
  }

  userPwdInfo.currPwdId--;
  return true;
}

export { savePwd, updatePwd, getPwd, deletePwd };
