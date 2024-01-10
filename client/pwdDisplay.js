const NUM_OF_PWD_IN_ONE_PAGE = 10;

export class PwdDisplay {
  constructor() {
    this.allPwd = []; // all passwords stores in a user's account, will be updated through "updateInfo" method

    // PwdDisplay will render the 10 passwords starting at "firstPwdOnCurrPage"th password in "allPwd". It will be updated
    // according to which page is the user current looking at in the database (each page can display at most 10 passwords)
    this.firstPwdOnCurrPage = 0;
    this.pwdNum = 0; // number of passwords stores in "allPwd"
  }

  async render(element) {
    let html = `<table>
      <thead>
        <tr>
          <th>Password Id</th>
          <th>Password Name</th>
          <th>Password</th>
        </tr>
      </thead>
      <tbody>
    `;

    this.allPwd.slice(this.firstPwdOnCurrPage, this.firstPwdOnCurrPage + NUM_OF_PWD_IN_ONE_PAGE).forEach((pwd) => {
      html += `
        <tr>
          <td>${pwd.pwdId}</td>
          <td>${pwd.pwdName}</td>
          <td>${pwd.pwd}</td>
        </tr>
      `;
    });

    html += `
      </tbody>
    </table>
    `;

    element.innerHTML = html;
  }

  // update "firstPwdOnCurrPage" so that the render function will render the password on the next page in the database with
  // respect to the current page that the user is on
  nextPage() {
    // make sure the page does not go over the last page
    if (this.firstPwdOnCurrPage + NUM_OF_PWD_IN_ONE_PAGE < this.pwdNum) {
      this.firstPwdOnCurrPage += NUM_OF_PWD_IN_ONE_PAGE;
    }
  }

  // update "firstPwdOnCurrPage" so that the render function will render the password on the previous page in the database with
  // respect to the current page that the user is on
  prevPage() {
    // make sure the page does not go before the first page
    if (this.firstPwdOnCurrPage - NUM_OF_PWD_IN_ONE_PAGE >= 0) {
      this.firstPwdOnCurrPage -= NUM_OF_PWD_IN_ONE_PAGE;
    }
  }

  // store a user's saved passwords
  updateInfo(userPwdInfo) {
    this.allPwd = userPwdInfo.savedPwd;
    this.pwdNum = this.allPwd.length;
  }
}
