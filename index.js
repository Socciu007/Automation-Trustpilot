const mails = require("./testmails.json");
const loginGoogle = require("./loginGoogle");
const Hidemyacc = require("./hidemyacc");
const hidemyacc = new Hidemyacc();

const randomstring = require("randomstring");
const puppeteer = require("puppeteer-core");
const PublicGoogleSheetsParser = require("public-google-sheets-parser");

const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

!(async () => {
  autoTrustPilot();
})();

// trustpilot
async function autoTrustPilot() {
  //await createProfile();
  //get profile
  const profileList = await hidemyacc.profiles();

  const profileId = profileList.data[0].id;
  const response = await hidemyacc.start(profileId, {
    startUrl: "about:blank",
  });
  if (response.code !== 1) {
    throw new Error("Khong mo duoc trinh duyet");
  }

  const browser = await puppeteer.connect({
    browserWSEndpoint: response.data.wsUrl,
    defaultViewport: null,
    slowMo: 60,
  });

  const pages = await browser.pages();
  let page;
  if (pages.length) {
    page = pages[0];
  } else {
    page = await browser.newPage();
  }

  await connectTrustPilot(page);
  await delay(1000);

  const listMails = mails.login;
  const page1 = await browser.newPage();
  await loginGoogle(page1, 0, listMails);
  await delay(3000);

  await getAndImportCode(page1, page);
  await delay(1000);

  // url anh
  const avatarUrls = [
    "pictures/anh1.jpg",
    "pictures/anh2.jpg",
    "pictures/anh3.jpg",
    "pictures/anh4.jpg",
    "pictures/anh5.jpg",
    "pictures/anh6.jpg",
    "pictures/anh7.jpg",
    "pictures/anh8.jpg",
    "pictures/anh9.jpg",
  ];
  await changeAvatarTrustPilot(page, avatarUrls);
  await delay(1000);

  //Danh gia sao cong ty trên trustpilot
  await page.goto("https://www.trustpilot.com/review/www.teespring.com", {
    timeout: 30000,
    waitUntil: "networkidle2",
  });
  await delay(1000);

  const evaluateNumberStar = ["1", "2", "3", "4", "5"];
  const numberStar =
    evaluateNumberStar[Math.floor(Math.random() * evaluateNumberStar.length)];
  const selector = 'input[value="{0}"]'.format(numberStar);
  await page.click(selector);
  await delay(1000);

  // Viet danh gia cong ty
  const spreadID = "1g3dGpCUW2W1UiuFyyCZK038GBo1uZbkJ5xU7S5QjOoA";
  await writeReviewForCompany(page, spreadID);
  await delay(3000);

  await hidemyacc.stop(profileId);
}

async function createProfile() {
  const proxy = JSON.stringify({
    host: "oneadx.ddns.net",
    mode: "http",
    password: "tien",
    port: 54019,
    username: "tien",
  });
  await hidemyacc.create({
    id: "",
    name: "trust1",
    os: "win",
    browserSource: "marco",
    browserType: "chrome",
    proxy: proxy,
  });
}

async function connectTrustPilot(page) {
  try {
    await page.goto("https://www.trustpilot.com/users/connect", {
      timeout: 30000,
      waitUntil: "networkidle0",
    });
    await delay(1000);

    // tat hien thi cookie trang trustpilot
    // await page.click('button[aria-label="Close"]');
    // await delay(1000);

    await page.click('button[name="reveal-email-flow"]');
    await delay(1000);

    //Nhap email dang nhap trustpilot
    await page.type('input[type="email"]', "hongmachenc3iipi2@gmail.com");
    await delay(1000);
    await page.keyboard.press("Enter");
    await delay(3000);

    const inputText = await page.$('input[type="text"]');
    const inputCheckbox = await page.$('input[type="checkbox"]');
    if (!inputText && !inputCheckbox) {
      console.log("Connect to trustpilot");
    } else {
      //Nhap ten user neu chua co ten user
      await page.type(
        'input[type="text"]',
        randomstring.generate({
          length: 7,
          charset: "alphabetic",
        })
      );
      await delay(1000);

      await page.click('input[type="checkbox"]');
      await delay(1000);

      await page.keyboard.press("Enter");
      await delay(3000);
    }
  } catch (e) {
    console.log(e);
  }
}
// lay và nhap code vao trustpilot
async function getAndImportCode(newPage, page) {
  try {
    //Lay ma code
    await newPage.goto("https://mail.google.com/mail/u/0/#inbox");
    await delay(1000);

    const spanElements = await newPage.$$("span.bog");
    const textCode = await spanElements[0].evaluate((span) =>
      span.textContent.slice(-4)
    );

    await newPage.close();
    await delay(1000);

    //Nhap ma code
    await page.type('input[maxlength="4"]', textCode.replace(/e/g, ""));
    await delay(1000);

    await page.keyboard.press("Enter");
    await delay(3000);
    console.log("Nhap code thanh cong");
  } catch (e) {
    console.log(e);
  }
}
// thay avt user trong trang trustpilot
async function changeAvatarTrustPilot(page, avatarUrls) {
  try {
    //chon ngau nhien avt thay
    const avatarUrl = avatarUrls[Math.floor(Math.random() * avatarUrls.length)];

    //truy cap trang can thay avt
    await page.goto("https://www.trustpilot.com/users/settings", {
      timeout: 30000,
      waitUntil: "networkidle0",
    });
    await delay(1000);

    const [fileAvatar] = await Promise.all([
      page.waitForFileChooser(),
      page.click('button[name="upload-profile-image'),
    ]);

    await fileAvatar.accept([avatarUrl]);
    await delay(1000);

    await page.click('button[name="personal-settings-submit"]');
    await delay(3000);
    console.log("Thay avt thanh cong");
  } catch (e) {
    console.log(e);
  }
}

async function writeReviewForCompany(page, spreadID) {
  try {
    const parser = new PublicGoogleSheetsParser(spreadID);
    const reviewsFromSheet = await parser.parse(spreadID, "Trust1");
    const review =
      reviewsFromSheet[Math.floor(Math.random() * reviewsFromSheet.length)];

    if (!page.isClosed()) {
      // Gửi yêu cầu tới trang ở đây
      await page.type(
        'textarea[aria-describedby="review-text-helper-text"]',
        review.Comments
      );
      await delay(1000);

      await page.evaluate((value) => {
        const dateInput = document.querySelector('input[type="date"]');
        dateInput.value = value;
      }, "2023-10-18");
      await delay(1000);

      await page.click('button[type="submit"] > span');
      await delay(3000);
      console.log("Write review success");
    }
  } catch (error) {
    console.log(error);
  }
}
String.prototype.format = function () {
  const args = arguments;
  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
};
