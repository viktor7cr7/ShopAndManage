export class BuyProducts {
  constructor(page) {
    this.page = page;
    this.productContainer = page.locator('.product-containter');
    this.countProductAfterFilters = page.locator('.count-product-search');
    this.filtersContainer = page.locator('#filters');
    this.filterSearch = page.locator('#filter-search');
    this.sortPrice = page.locator('#sort-price');
    this.filterCategory = page.locator('#filter-category');
    this.sortRating = page.locator('#sort-rating');
    this.btnApplyRange = page.locator('.btn-apply');
    this.showPriceRange = page.locator('.hidden-range');
    this.hiddenPriceRange = page.locator('.show-range');
    this.rangeTrack = page.locator('.track-values');
    this.rigthSlider = page.locator('.track-values > div:nth-child(2)');
    this.btnResetFilters = page.locator('.link-reset');
    this.modalBuyProduct = page.locator('.modal-buy');
    this.descriptionProduct = page.locator('.product-description');
    this.modalDescription = page.locator('.modal-description');
    this.prevBtn = page.locator('.prev-btn');
    this.nextBtn = page.locator('.next-btn');
    this.pageBtn = page.locator('.page-btn');
  }

  async navigate() {
    return this.page.goto('/dashboard/user/all-products');
  }

  getProductContainer() {
    return this.productContainer;
  }

  getCountProductAfterFilters() {
    return this.countProductAfterFilters;
  }

  getFiltersContainer() {
    return this.filtersContainer;
  }

  getFilterSearch() {
    return this.filterSearch;
  }

  getSortPrice() {
    return this.sortPrice;
  }

  getFilterCategory() {
    return this.filterCategory;
  }

  getSortRating() {
    return this.sortRating;
  }

  getShowRangeBtn() {
    return this.showPriceRange;
  }

  getHiddenRangeBtn() {
    return this.hiddenPriceRange;
  }

  getRangeTrack() {
    return this.rangeTrack;
  }

  getRigthSlider() {
    return this.rigthSlider;
  }

  getBtnApplyRange() {
    return this.btnApplyRange;
  }

  getBtnResetFilters() {
    return this.btnResetFilters;
  }

  getModalBuyProduct() {
    return this.modalBuyProduct;
  }

  getDescriptionProduct() {
    return this.descriptionProduct;
  }

  getModalDescription() {
    return this.modalDescription;
  }

  getPrevBtn() {
    return this.prevBtn;
  }

  getNextBtn() {
    return this.nextBtn;
  }

  getPageBtn() {
    return this.pageBtn;
  }
}
