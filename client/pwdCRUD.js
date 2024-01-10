// send a POST request to the server to create an new user account given the username and login password
async function createAccount(username, loginPwd) {
  try {
    const response = await fetch(`/createAccount?username=${username}&loginPwd=${encodeURIComponent(loginPwd)}`, {
      method: "POST",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error: ", error);
  }
}

// send a GET request to the server to get the information of the user account that matches the given username 
// and login password
async function loginAccount(username, loginPwd) {
  try {
    const response = await fetch(`/loginAccount?username=${username}&loginPwd=${loginPwd}`, { method: "GET" });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error: ", error);
  }
}

// send a POST request to the server to save the given password and password name in the user account that 
// matches the given username
async function savePwd(username, pwd, pwdName) {
  try {
    const response = await fetch(
      `/savePassword?username=${username}&pwd=${encodeURIComponent(pwd)}&pwdName=${pwdName}`,
      {
        method: "POST",
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error: ", error);
  }
}

// send a PUT request to the server to update the the password, that has the same given pwdId in the user 
// account that matches the given username, to the given new password and new password name
async function updatePwd(username, pwdId, newPwd, newPwdName) {
  try {
    const response = await fetch(
      `/updatePassword?username=${username}&pwdId=${pwdId}&newPwd=${encodeURIComponent(
        newPwd
      )}&newPwdName=${newPwdName}`,
      { method: "PUT" }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error: ", error);
  }
}

// send a GET request to the server to get the password that has the same given pwdId in the user account 
// that matches the given username
async function getPwd(username, pwdId) {
  try {
    const response = await fetch(`/getPassword?username=${username}&pwdId=${pwdId}`, { method: "GET" });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error: ", error);
  }
}

// send a DELETE request to the server to delete the password that has the same given pwdId in the user account 
// that matches the given username
async function deletePwd(username, pwdId) {
  try {
    const response = await fetch(`/deletePassword?username=${username}&pwdId=${pwdId}`, { method: "DELETE" });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export { createAccount, loginAccount, savePwd, updatePwd, getPwd, deletePwd };
