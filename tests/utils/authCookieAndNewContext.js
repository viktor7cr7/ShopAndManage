
import { chromium} from "playwright";
import { setBrowserAdminCookies, setBrowserCookies } from "./setCookies";

export const authCookieAndNewContext = async () => {
    let browser = await chromium.launch()
    let context = await browser.newContext()

    const email = 'victor@mail.ru';
    const password = 'BETejEmm321';

    setBrowserAdminCookies(context, email, password)

    const page = await context.newPage()
    return page
}

export const authCookieAndNewContextUser = async () => {
    let browser = await chromium.launch()
    let context = await browser.newContext()

    const email = 'victor@mail.ru';
    const password = 'BETejEmm321';

    setBrowserCookies(context, email, password)

    const page = await context.newPage()
    return page
}

