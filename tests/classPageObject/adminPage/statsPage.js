export class StatsPage {
  constructor(page) {
    this.page = page;
    this.headerContainer = page.locator('.header-container');
    this.statsContainer = page.locator('.stats-container');
  }

  async navigate() {
    return this.page.goto('/dashboard/admin/stats');
  }

  getHeaderContainer() {
    return this.headerContainer;
  }

  getStatsContainer() {
    return this.statsContainer;
  }
}
