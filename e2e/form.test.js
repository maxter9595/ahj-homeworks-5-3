const puppeteer = require("puppeteer");

describe("Trip Calendar Widget", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    await page.goto("http://localhost:9000/");
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Should display error popovers for empty required fields", async () => {
    await page.click("#trip-form button[type='submit']");
    const fromError = await page.$("#from + .popover-container .popover");
    const toError = await page.$("#to + .popover-container .popover");
    const departureError = await page.$(
      "#departure-date + .popover-container .popover",
    );
    expect(fromError).not.toBeNull();
    expect(toError).not.toBeNull();
    expect(departureError).not.toBeNull();
  });

  test("Should allow selecting departure and return dates", async () => {
    await page.type("#from", "Москва");
    await page.type("#to", "Санкт-Петербург");
    await page.click(".checkmark");
    await page.click("#departure-date");
    await page.evaluate(() => {
      document.querySelector("#departure-date").value = new Date()
        .toISOString()
        .split("T")[0];
    });
    const departureDate = await page.$eval("#departure-date", (el) => el.value);
    expect(departureDate).not.toBe("");
    await page.click("#return-date");
    await page.evaluate(() => {
      document.querySelector("#return-date").value = new Date()
        .toISOString()
        .split("T")[0];
    });
    const returnDate = await page.$eval("#return-date", (el) => el.value);
    expect(returnDate).not.toBe("");
  });

  test("Should successfully submit the form and show success message", async () => {
    await page.type("#from", "Москва");
    await page.type("#to", "Санкт-Петербург");
    await page.click("#departure-date");
    await page.keyboard.press("Enter");
    await page.click("#trip-form button[type='submit']");
    const successMessage = await page.$("#success-message:not(.hidden)");
    expect(successMessage).not.toBeNull();
  });
});
