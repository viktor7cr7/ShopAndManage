export class EditPage {
  constructor(page) {
    this.page = page;
    this.titlePage = page.locator('.form-title');
    this.inputName = page.locator('#name');
    this.inputPrice = page.locator('#price');
    this.inputDescription = page.locator('#description');
    this.inputQuantity = page.locator('#quantity');
    this.selectCategory = page.locator('#category');
    this.btnSubmit = page.locator('.form-btn');
    this.downloadImgProduct = page.locator('#product_img');
  }

  getTitlePage() {
    return this.titlePage;
  }

  getInputName() {
    return this.inputName;
  }

  getInputDescription() {
    return this.inputDescription;
  }

  getSelectCategory() {
    return this.selectCategory;
  }

  getBtnSubmit() {
    return this.btnSubmit;
  }

  getDownloadImgProduct() {
    return this.downloadImgProduct;
  }

  getInputQuantity() {
    return this.inputQuantity;
  }

  getInputPrice() {
    return this.inputPrice;
  }
}
