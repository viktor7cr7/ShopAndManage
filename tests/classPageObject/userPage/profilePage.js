export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.form-title');
    this.downloadAvatar = page.locator('#avatar');
    this.emailInput = page.locator('#email');
    this.btnSaveChanges = page.locator('#saveChanges');
    this.gradesHeader = page.locator('.grades-header');
    this.gradesContainer = page.locator('.grades-container');
    this.myInfoGrades = page.locator('.info-grades');
  }

  async navigate() {
    return this.page.goto('/dashboard/user/profile');
  }

  getBalance() {
    return this.page.locator('.balance-btn');
  }

  getTitle() {
    return this.title;
  }

  getDownloadAvatar() {
    return this.downloadAvatar;
  }

  getEmailInput() {
    return this.emailInput;
  }

  getBtnSaveChanges() {
    return this.btnSaveChanges;
  }

  getGradesHeader() {
    return this.gradesHeader;
  }

  getGradesContainer() {
    return this.gradesContainer;
  }

  getMyInfoGrades() {
    return this.myInfoGrades;
  }
}
