import { loginUser, loginAdmin } from './auth';

const domain = process.env.DOMAIN || 'localhost'

export async function setBrowserCookies(context, email, password) {
  try {
    const cookies = await loginUser(email, password);

    // Преобразование куков в формат, который принимает Playwright
    const playwrightCookies = cookies.map(cookie => {
      const [name, value] = cookie.split(';')[0].split('=');
      return {
        name,
        value,
        domain: domain,
        path: '/',
        httpOnly: true,
        expires: Date.now() / 1000 + 24 * 60 * 60
      };
    });

    // Установить куки в контексте браузера
    await context.addCookies(playwrightCookies);
    await context.cookies();

  } catch (error) {
    console.error('Ошибка установки куки в браузере:', error);
    throw error;
  }
}

export async function setBrowserAdminCookies(context, email, password) {
  try {
    const cookies = await loginAdmin(email, password);

    // Преобразование куков в формат, который принимает Playwright
    const playwrightCookies = cookies.map(cookie => {
      const [name, value] = cookie.split(';')[0].split('=');
      return {
        name,
        value,
        domain: domain,
        path: '/',
        httpOnly: true,
        expires: Date.now() / 1000 + 24 * 60 * 60
      };
    });

    // Установить куки в контексте браузера
    await context.addCookies(playwrightCookies);
    await context.cookies();

  } catch (error) {
    console.error('Ошибка установки куки в браузере:', error);
    throw error;
  }
}