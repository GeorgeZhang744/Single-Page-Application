const NUM_OF_PWD_IN_ONE_PAGE = 10;

export class PwdPageFlipper {
  constructor() {
    this.currPage = 1;
    this.maxPageNum = 1; // last page
  }

  async render(element) {
    const prevPageBtnElement = element.children[0];
    const currPageElement = element.children[1];
    const nextPageBtnElement = element.children[2];

    // display the current page number
    currPageElement.innerHTML = this.currPage;

    // disable the next page button if the current page is already on the last page
    nextPageBtnElement.disabled = this.currPage === this.maxPageNum;

    // disable the previous page button if the current page is already on the first page
    prevPageBtnElement.disabled = this.currPage === 1;
  }

  // flip the current page to the next page by incrementing "currPage" by 1
  nextPage() {
    // only flips the page if the current page is not on the last page
    if (this.currPage < this.maxPageNum) {
      this.currPage++;
    }
  }

  // flip the current page to the previous page by decrementing "currPage" by 1
  prevPage() {
    // only flips the page if the current page is not on the first page
    if (this.currPage > 1) {
      this.currPage--;
    }
  }

  // store a user's saved passwords, and calculate the max number of pages according the total number of saved passwords
  updateInfo(userPwdInfo) {
    const savedPwdLength = userPwdInfo.savedPwd.length;
    this.maxPageNum = savedPwdLength === 0 ? 1 : Math.ceil(savedPwdLength / NUM_OF_PWD_IN_ONE_PAGE);
  }
}
