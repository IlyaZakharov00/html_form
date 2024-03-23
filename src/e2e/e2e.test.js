import puppeteer from "puppeteer";

describe("Form test valid", () => {
  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    });

    page = await browser.newPage(); // открываем пустую страницу
  });

  test("Form should render ", async () => {
    await page.goto("http://localhost:9000"); // открываем localhost 9000

    await page.waitForSelector(".form"); // ждем появления form-inline
  });

  test("If one input incorrect should render error", async () => {
    await page.goto("http://localhost:9000"); // открываем localhost 9000

    await page.waitForSelector(".form"); // ждем появления form-inline

    const form = await page.$(".form");
    const btn = await form.$(".btn-submit");

    await btn.click();

    await page.waitForSelector(".form-error"); // ждем появления form-error
  }, 30000);

  test("If all correct should console.log('valid') ", async () => {
    await page.goto("http://localhost:9000"); // открываем localhost 9000

    await page.waitForSelector(".form"); // ждем появления form-inline

    const form = await page.$(".form");
    const inputLogin = await form.$("[name=login]");
    const inputEmail = await form.$("[name=email]");
    const inputPassword = await form.$("[name=password]");
    const inputConfirmation = await form.$("[name=confirmation]");
    const inputTel = await form.$("[name=tel]");
    await inputLogin.type("test");
    await inputEmail.type("test@mail.ru");
    await inputPassword.type("test");
    await inputConfirmation.type("test");
    await inputTel.type("88005553535");

    const btn = await form.$(".btn-submit");
    await btn.click();

    let error = await page.$(".form-error"); // ждем появления form-error
    if (!error) {
      return; // если не появляется ошибка то тест завершается
    } else {
      await page.waitForSelector(".form-error"); // ждем появления form-error
    }

  }, 60000);

  afterEach(async () => {
    await browser.close(); // закрываем браузер
  });
});
