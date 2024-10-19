export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.downloadAvatar = page.locator('#avatar');
    this.inputName = page.locator('#name');
    this.inputEmail = page.locator('#email');
    this.btnSaveChanges = page.locator('.form-btn');
  }

  async navigate() {
    return this.page.goto('/dashboard/admin/profile');
  }

  getDownloadAvatar() {
    return this.downloadAvatar;
  }

  getInputName() {
    return this.inputName;
  }

  getInputEmail() {
    return this.inputEmail;
  }

  getBtnSaveChanges() {
    return this.btnSaveChanges;
  }
}
