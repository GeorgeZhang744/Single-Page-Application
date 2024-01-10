import { COMPONENTS, FILTERS, pwdGenerator } from "./generator.js";
import { loginAccount, savePwd, deletePwd, updatePwd, createAccount, getPwd } from "./pwdCRUD.js";
import { PwdDisplay } from "./pwdDisplay.js";
import { PwdPageFlipper } from "./pwdPageFlipper.js";

// pwd options elements
const lengthSelectionElement = document.getElementById("length-selection");
const numberCheckboxElement = document.getElementById("number-checkbox");
const lowercaseCheckboxElement = document.getElementById("lowercase-checkbox");
const uppercaseCheckboxElement = document.getElementById("uppercase-checkbox");
const symbolCheckboxElement = document.getElementById("symbol-checkbox");
const similarCheckboxElement = document.getElementById("similar-checkbox");
const ambiguousCheckboxElement = document.getElementById("ambiguous-checkbox");
const applySliderCheckboxElement = document.getElementById("slider-checkbox");
const sliderRangeElement = document.getElementById("slider-range");

// control elements
const pwdNameElement = document.getElementById("pwd-name");
const generatedPwdElement = document.getElementById("generated-pwd");
const generateBtnElement = document.getElementById("generate");
const copyBtnElement = document.getElementById("copy");
const saveBtnElement = document.getElementById("save");
const savedPwdElement = document.getElementById("saved-pwd");

// login elements
const popupBackgroundElement = document.getElementById("popup-background");
const loginPopupElement = document.getElementById("login-popup");
const loginUsernameElement = document.getElementById("login-username");
const loginPasswordElement = document.getElementById("login-password");
const continueBtnElement = document.getElementById("login-btn");
const loginErrMsgElement = document.getElementById("login-err-msg");

// create user account elements:
const createAccountPopupElement = document.getElementById("create-account-popup");
const newUsernameElement = document.getElementById("new-username");
const userPwdElement = document.getElementById("user-password");
const signupBtnElement = document.getElementById("sign-up-btn");
const createNewAccountBtnElement = document.getElementById("create-new-account");
const exitLoginBtnElement = document.getElementById("exit-login");
const cancelSignupBtnElement = document.getElementById("cancel-sign-up");
const signupErrMsgElement = document.getElementById("sign-up-err-msg");

// pwd database displaying elements
const databasePopupElement = document.getElementById("pwd-database-popup");
const pwdDisplayElement = document.getElementById("pwd-displaying");
const pwdIdSelectorElement = document.getElementById("id-selector");
const databaseCopyBtnElement = document.getElementById("copy-in-database");
const deleteBtnElement = document.getElementById("delete");
const updateBtnElement = document.getElementById("update");
const pageFlipperElement = document.getElementById("page-flipper");
const prevPageBtnElement = document.getElementById("prev-page");
const nextPageBtnElement = document.getElementById("next-page");
const exitDatabaseBtnElement = document.getElementById("exit-database");

// pwd updating elements:
const pwdUpdatePopupBackgroundElement = document.getElementById("pwd-update-popup-background");
const pwdUpdatePopupElement = document.getElementById("pwd-update-popup");
const newPwdNameElement = document.getElementById("new-pwd-name");
const newPwdElement = document.getElementById("new-pwd");
const confirmUpdateBtnElement = document.getElementById("confirm");

// loading
const loadingPopupBackgroundElement = document.getElementById("loading-background");

let username = null; // username of the current signed in user
let userLoginPwd = null; // password the current signed in user
const pwdDisplay = new PwdDisplay(); // an object that helps to display the passwords of the current signed user
const pwdPageFlipper = new PwdPageFlipper(); // an object that helps to display the page flipper based on the number of passwords that the current signed user has
 
// set to true if the user click the save button to save a new password
// set to false if the user click the savedPassword button to see his saved password
let isSaving;

// ------------------------------------------------Helper functions----------------------------------------------------------------------
// empty the text boxes in login form and sign in form
function emptyLoginSignInTextBoxes() {
  newUsernameElement.value = "";
  userPwdElement.value = "";
  loginUsernameElement.value = "";
  loginPasswordElement.value = "";
}

// update the pwdDisplay and pwdPageFlipper objects after the user operates (save/delete/update) his/her passwords in the database
function updatePwdDatabase(updatedInfo) {
  pwdDisplay.updateInfo(updatedInfo.userPwdInfo);
  pwdPageFlipper.updateInfo(updatedInfo.userPwdInfo);
}

// flip to the previous page of the password displaying page
function goPrevPage() {
  pwdDisplay.prevPage();
  pwdPageFlipper.prevPage();
}

// flip to the next page of the password displaying page
function goNextPage() {
  pwdDisplay.nextPage();
  pwdPageFlipper.nextPage();
}

// render the password displaying page
async function renderPwdDatabase() {
  await pwdDisplay.render(pwdDisplayElement);
  await pwdPageFlipper.render(pageFlipperElement);
}

// display the loading popup when the server is operating passwords in the database to ensure that the user won't be able 
// to interact with the webpage until the operation is ended 
function loading() {
  loadingPopupBackgroundElement.style.display = "block";
}

// hide the loading popup after the server finishes operating the database so that the user can keep interact with the webpage
function loadingEnd() {
  loadingPopupBackgroundElement.style.display = "none";
}

// save the user's current setting of his/her password generator in the local storage so that the next time their current setting
// will be shown as default
function savePwdSettings() {
  localStorage.setItem("pwdLength", lengthSelectionElement.value);
  localStorage.setItem("includeNumber", numberCheckboxElement.checked);
  localStorage.setItem("includeLowercase", lowercaseCheckboxElement.checked);
  localStorage.setItem("includeUppercase", uppercaseCheckboxElement.checked);
  localStorage.setItem("includeSymbol", symbolCheckboxElement.checked);
  localStorage.setItem("excludeSimilar", similarCheckboxElement.checked);
  localStorage.setItem("excludeAmbiguous", ambiguousCheckboxElement.checked);
  localStorage.setItem("applySlider", applySliderCheckboxElement.checked);
  localStorage.setItem("sliderRange", sliderRangeElement.value);
}

// retrieve the password setting of the previous users
function restorePwdSetting() {
  const restoreSavedSetting = (element, settingName) => {
    if (localStorage.getItem(settingName)) {
      const savedSetting = localStorage.getItem(settingName);
      if (element.type === "checkbox") {
        element.checked = savedSetting === "true";
      } else {
        element.value = savedSetting;
      }
    }
  };

  restoreSavedSetting(lengthSelectionElement, "pwdLength");
  restoreSavedSetting(numberCheckboxElement, "includeNumber");
  restoreSavedSetting(lowercaseCheckboxElement, "includeLowercase");
  restoreSavedSetting(uppercaseCheckboxElement, "includeUppercase");
  restoreSavedSetting(symbolCheckboxElement, "includeSymbol");
  restoreSavedSetting(similarCheckboxElement, "excludeSimilar");
  restoreSavedSetting(ambiguousCheckboxElement, "excludeAmbiguous");
  restoreSavedSetting(applySliderCheckboxElement, "applySlider");
  restoreSavedSetting(sliderRangeElement, "sliderRange");
}
// ------------------------------------------------Helper functions end------------------------------------------------------------------

restorePwdSetting();

// ------------------------------------------Event listeners for the HTML elements-------------------------------------------------------
// Automatically save user's password setting in the browser
lengthSelectionElement.addEventListener("change", savePwdSettings);
numberCheckboxElement.addEventListener("click", savePwdSettings);
lowercaseCheckboxElement.addEventListener("click", savePwdSettings);
uppercaseCheckboxElement.addEventListener("click", savePwdSettings);
symbolCheckboxElement.addEventListener("click", savePwdSettings);
similarCheckboxElement.addEventListener("click", savePwdSettings);
ambiguousCheckboxElement.addEventListener("click", savePwdSettings);
applySliderCheckboxElement.addEventListener("click", savePwdSettings);
sliderRangeElement.addEventListener("input", savePwdSettings);

// ----------------------------------------------Components in the main panel of the generators----------------------------------------------
// "click" event listener for the "generate" button on the main panel of the password generator
// generate user's password based on the setting that they set up
generateBtnElement.addEventListener("click", () => {
  // update the length of the generated password
  pwdGenerator.setLength(lengthSelectionElement.value);

  // if a component checkbox is true, then its corresponding component will be include in the generated password
  let componentsInHTML = [
    numberCheckboxElement.checked,
    lowercaseCheckboxElement.checked,
    uppercaseCheckboxElement.checked,
    symbolCheckboxElement.checked,
  ];

  // if a filter checkbox is true, then its corresponding component will be exclude from the components that are already included
  const filtersInHTML = [similarCheckboxElement.checked, ambiguousCheckboxElement.checked];

  // Check if the user wants to generate his/her password using the password strength slider
  // the four elements of "componentsInHTML" represent different password components: [number, lowercase, uppercase, symbol]
  if (applySliderCheckboxElement.checked) {
    switch (parseInt(sliderRangeElement.value)) {
      case 0: // weak password strength
        // the generated password will only include numbers
        componentsInHTML = [true, false, false, false];
        break;
      case 1: // median password strength
        // the generated password will include numbers, lowercase letters, and uppercase letters
        componentsInHTML = [true, true, true, false];
        break;
      case 2: // strong password strength
        // the generated password will include numbers, lowercase letters, uppercase letters, and symbols
        componentsInHTML = [true, true, true, true];
        break;
      default:
        break;
    }
  }

  // add the password components that the user set up to include in his/her password
  COMPONENTS.forEach((component, index) => {
    pwdGenerator.setIncludedComponent(component, componentsInHTML[index]);
  });

  // filter out the characters that the user set up to not include in his/her password
  FILTERS.forEach((filter, index) => {
    pwdGenerator.setFilter(filter, filtersInHTML[index]);
  });

  // generate the password after the password setting is set up
  const generatedPwd = pwdGenerator.generate();

  // the generatedPwd will be -1 if the user did not select any components to be included in the password, raise an alert if this happens
  if (generatedPwd === -1) {
    generatedPwdElement.value = "";
    alert("Please select something to be included in your password!");
    return;
  }

  // display the generated password in the corresponding text box on the webpage
  generatedPwdElement.value = generatedPwd;
});

// "click" event listener for the "copy" button on the main panel of the password generator
// copy the generated password to the user's clipboard
copyBtnElement.addEventListener("click", () => {
  const generatedPwd = generatedPwdElement.value;
  if (generatedPwd) {
    navigator.clipboard.writeText(generatedPwd);
  }
});

// "click" event listener for the "save" button on the main panel of the password generator
// save the generated password and the name that the user assigned to the password in the user's account in the database
saveBtnElement.addEventListener("click", async () => {
  const pwdName = pwdNameElement.value;
  const generatedPwd = generatedPwdElement.value;

  // return if the user did not generate any password yet
  if (!generatedPwd) {
    return;
  }

  // let the event listener for continueBtnElement to know that the user is saving a password
  isSaving = true;

  // check if there is already a user signed in
  if (!username) {
    // if not, pop up the login panel to let the user log in into his/her account
    popupBackgroundElement.style.display = "block";
    loginPopupElement.style.display = "block";
  } else {
    // otherwise, save the current generated password and then display the saved passwords of the signed in user
    loading();
    await savePwd(username, generatedPwd, pwdName);
    pwdNameElement.value = "";
    generatedPwdElement.value = "";
    loadingEnd();
  }
});

// "click" event listener for the "saved password" button on the main panel of the password generator
// display the user's saved passwords
savedPwdElement.addEventListener("click", async () => {
  // let the event listener for continueBtnElement to know that the user is trying to see his/her saved passwords
  isSaving = false;
  popupBackgroundElement.style.display = "block";

  // check if there is already a user signed in
  if (!username) {
    // if not, pop up the login panel to let the user log in into his/her account
    loginPopupElement.style.display = "block";
  } else {
    // otherwise, directly display the saved passwords of the signed in user
    const updatedInfo = await loginAccount(username, userLoginPwd);
    updatePwdDatabase(updatedInfo);
    await renderPwdDatabase();
    databasePopupElement.style.display = "block";
  }
});
// ----------------------------------------------Components in the main panel of the generators end-------------------------------------------


// ---------------------------------------------------Components in the login popup----------------------------------------------------
// "click" event listener for the "sign up" button on the login popup
// display the sign up popup to let the user sign up an account
signupBtnElement.addEventListener("click", () => {
  // display the sign up popup and temporality hide the login popup
  createAccountPopupElement.style.display = "flex";
  loginPopupElement.style.display = "none";
});

// "click" event listener for the "continue" button on the login popup
// Verify the user's username and password, if they are matched in the database, log the user in and display his/her saved passwords
continueBtnElement.addEventListener("click", async () => {
  const loginUsername = loginUsernameElement.value;
  const loginPwd = loginPasswordElement.value;
  emptyLoginSignInTextBoxes();

  // check if the user's username and password are correct (they are matched in the database)
  const loginInfo = await loginAccount(loginUsername, loginPwd);
  if (loginInfo.error) {
    // display the error message if the username and password are not correct
    loginErrMsgElement.style.display = "block";
  } else {
    // set the global variable "username" and "userLoginPwd" to the corresponding values that the user inputted, indicating
    // that he/she is successfully signed in (he/she does not need to log in again unless the webpage is refreshed)
    username = loginInfo.username;
    userLoginPwd = loginInfo.loginPwd;

    // check if the user has generated a password and is trying to save it
    if (isSaving && generatedPwdElement.value) {
      const pwdName = pwdNameElement.value;
      const generatedPwd = generatedPwdElement.value;
      pwdNameElement.value = "";
      generatedPwdElement.value = "";

      // if so, save the password into the database and then update the saved password displayer (pwdDisplay and pwdPageFlipper objects)
      await savePwd(username, generatedPwd, pwdName);
      const updatedInfo = await loginAccount(loginUsername, loginPwd);
      updatePwdDatabase(updatedInfo);
    } else {
      // if the user is not saving new password, just update the saved password displayer directly
      updatePwdDatabase(loginInfo);
    }

    // render the password display and page flipper
    await renderPwdDatabase();

    // hide the login popup and display the rendered saved passwords 
    loginPopupElement.style.display = "none";
    databasePopupElement.style.display = "block";
  }
});

// "click" event listener for the "exit" button on the login popup
// hide the login popup and reset the values of the text boxes within it
exitLoginBtnElement.addEventListener("click", () => {
  emptyLoginSignInTextBoxes();
  loginErrMsgElement.style.display = "none";
  signupErrMsgElement.style.display = "none";
  popupBackgroundElement.style.display = "none";
});
// ---------------------------------------------------Components in the login popup end------------------------------------------------


// ---------------------------------------------------Components in the sign up popup---------------------------------------------------
// "click" event listener for the "create" button on the sign up popup
// create an new user account using the the username and password that the user inputted
createNewAccountBtnElement.addEventListener("click", async () => {
  const newUsername = newUsernameElement.value;
  const userPwd = userPwdElement.value;
  emptyLoginSignInTextBoxes();

  // create an new user account using the inserted information
  const result = await createAccount(newUsername, userPwd);

  // check if the creation was successful
  if (result.error) {
    // if an error happens (username already existed or didn't insert username/password), display the error message
    signupErrMsgElement.innerHTML = result.error;
    signupErrMsgElement.style.display = "block";
    return;
  } else {
    // if no error happens, close the sign in popup
    loginErrMsgElement.style.display = "none";
    signupErrMsgElement.style.display = "none";
    createAccountPopupElement.style.display = "none";
    loginPopupElement.style.display = "block";
    popupBackgroundElement.style.display = "block";
  }
});

// "click" event listener for the "cancel" button on the sign up popup
// exit the sign up popup and reset the values of the text boxes within it
cancelSignupBtnElement.addEventListener("click", () => {
  emptyLoginSignInTextBoxes();
  createAccountPopupElement.style.display = "none";
  loginErrMsgElement.style.display = "none";
  signupErrMsgElement.style.display = "none";
  loginPopupElement.style.display = "block";
});
// ---------------------------------------------------Components in the sign up popup end------------------------------------------------


// -------------------------------------------------Components in the password database popup-----------------------------------------------
// "click" event listener for the "copy" button on the password database popup
// copy the password with the pwdId selected by the user to his/her clipboard
databaseCopyBtnElement.addEventListener("click", async () => {
  const pwdId = pwdIdSelectorElement.value;
  pwdIdSelectorElement.value = "";

  // if the user did not insert a pwdId, raise an alert to let him/her choose one
  if (!pwdId) {
    alert("Please insert the Id of the password that you want to copy");
    return;
  }

  // use the username of the user's account and the pwdId that the user selected to get the corresponding password from the database
  loading();
  const result = await getPwd(username, pwdId);
  if (result.error) {
    // if an error happens while getting the password, raise an alert to display that error to the user
    loadingEnd();
    alert(result.error);
    return;
  }
  // if no error happens, copy the retrieved password to the user's clipboard
  const pwd = result.pwd;
  navigator.clipboard.writeText(pwd);
  loadingEnd();
});

// "click" event listener for the "delete" button on the password database popup
// delete the password with the pwdId selected by the user and then re-render the popup after the deletion
deleteBtnElement.addEventListener("click", async () => {
  const pwdId = pwdIdSelectorElement.value;
  pwdIdSelectorElement.value = "";

  // if the user did not insert a pwdId, raise an alert to let him/her choose one
  if (!pwdId) {
    alert("Please insert the Id of the password that you want to delete");
    return;
  }

  // use the username of the user's account and the pwdId that the user selected to delete the corresponding password from the database
  loading();
  const result = await deletePwd(username, pwdId);
  if (result.error) {
    // if an error happens while deleting the password, raise an alert to display that error to the user
    loadingEnd();
    alert(result.error);
    return;
  }
  // if no error happens, re-render the popup after the deletion
  const updatedInfo = await loginAccount(username, userLoginPwd);
  updatePwdDatabase(updatedInfo);
  await renderPwdDatabase();
  loadingEnd();
});

// "click" event listener for the "update" button on the password database popup
// part of the procedure to update the password with the pwdId selected by the user
updateBtnElement.addEventListener("click", () => {
  // if the user did not insert a pwdId, raise an alert to let him/her choose one
  if (!pwdIdSelectorElement.value) {
    alert("Please insert the Id of the password that you want to update");
    return;
  }

  // display a new popup to let the user fill in the new name/password for the password that he/she selects
  pwdUpdatePopupBackgroundElement.style.display = "block";
  pwdUpdatePopupElement.style.display = "flex";
});

// "click" event listener for the "update" button on the update popup triggered by the event listener of "updateBtnElement"
// part of the procedure to update the password with the pwdId selected by the user
confirmUpdateBtnElement.addEventListener("click", async () => {
  pwdUpdatePopupBackgroundElement.style.display = "none";
  const pwdId = pwdIdSelectorElement.value;
  const newPwdName = newPwdNameElement.value;
  const newPwd = newPwdElement.value;

  pwdIdSelectorElement.value = "";
  newPwdNameElement.value = "";
  newPwdElement.value = "";

  // use the username of the user's account, the pwdId that the user selected, new password, and the new name for the updated
  // password, to update the corresponding password in the database
  loading();
  const result = await updatePwd(username, pwdId, newPwd, newPwdName);
  // check if the updating was successful
  if (result.error) {
    // if an error happens while updating the password, raise an alert to display that error to the user
    loadingEnd();
    alert(result.error);
    return;
  }
  // if no error happens, re-render the popup after the deletion
  const updateInfo = await loginAccount(username, userLoginPwd);
  updatePwdDatabase(updateInfo);
  await renderPwdDatabase();
  loadingEnd();
});

// "click" event listener for the "<-" button on the password database popup
// flip to the previous page of the password display
prevPageBtnElement.addEventListener("click", async () => {
  goPrevPage();
  await renderPwdDatabase();
});

// "click" event listener for the "->" button on the password database popup
// flip to the next page of the password display
nextPageBtnElement.addEventListener("click", async () => {
  goNextPage();
  await renderPwdDatabase();
});

// "click" event listener for the "exit" button on the password database popup
// exit the password database popup
exitDatabaseBtnElement.addEventListener("click", () => {
  pwdIdSelectorElement.value = "";
  databasePopupElement.style.display = "none";
  popupBackgroundElement.style.display = "none";
});
// -------------------------------------------------Components in the password database popup end--------------------------------------------

// -------------------------------------------------Event listeners for the HTML elements end----------------------------------------------------
