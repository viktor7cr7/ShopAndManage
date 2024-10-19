import { chromium } from "playwright";
import { setBrowserAdminCookies, setBrowserCookies } from "./setCookies";

export const authCookieAndNewContext = async () => {
  let browser = await chromium.launch();
  let context = await browser.newContext();

  const email = "test-email@mail.ru";
  const password = "BETejEmm321";

  await setBrowserAdminCookies(context, email, password);

  const page = await context.newPage();
  return { page: page, close: async () => await browser.close() };
};

export const authCookieAndNewContextUser = async () => {
  let browser = await chromium.launch();
  let context = await browser.newContext();

  const email = "test-email@mail.ru";
  const password = "BETejEmm321";

  await setBrowserCookies(context, email, password);

  const page = await context.newPage();

  return { page: page, close: async () => await browser.close() };
};
