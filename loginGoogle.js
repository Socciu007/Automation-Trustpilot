const Hidemyacc = require("./hidemyacc");
const hidemyacc = new Hidemyacc();
const puppeteer = require("puppeteer-core");
const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

async function checkLogin(page, emails, passwords) {
  const response = {
    susscess: 0,
    msg: "",
  };

  await page.type('input[type="email"]', emails);
  await delay(1000);

  await page.keyboard.press("Enter");
  await delay(3000);

  const emailsCapcha = [];
  let url = await page.url();

  if (url.includes("v3/signin/identifier")) {
    response.msg = "email wrong";
    return response;
  } else if (url.includes("v2/challenge/recaptcha?")) {
    response.susscess = 2;
    response.msg = "capcha";
    emailsCapcha.push(emails);
    return response;
  } else {
    await page.type('input[type="password"]', passwords);
    await delay(1000);

    await page.keyboard.press("Enter");
    await delay(3000);

    url = await page.url();
    if (!url.includes("v3/signin/challenge/pwd?")) {
      response.susscess = 1;
      response.msg = "login susscess";
    } else {
      response.msg = "password wrong";
    }
  }
  return response;
}

async function runLimitEmailCapcha(func, limit) {
  for (let i = 0; i < limit; i++) {
    return await func();
  }
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

// de quy login
async function runLogin(page, countEmail, emailList) {
  // await createProfile();
  // //get profile
  // const profileList = await hidemyacc.profiles();

  // const profileId = profileList.data[0].id;
  // const response = await hidemyacc.start(profileId, {
  //   startUrl: "about:blank",
  // });
  // if (response.code !== 1) {
  //   throw new Error("Khong mo duoc trinh duyet");
  // }

  // const browser = await puppeteer.connect({
  //   browserWSEndpoint: response.data.wsUrl,
  //   defaultView: null,
  //   slowMo: 60,
  // });

  // const pages = await browser.pages();
  // let page;
  // if (pages.length) {
  //   page = pages[0];
  // } else {
  //   page = await browser.newPage();
  // }
  if (countEmail < emailList.length) {
    try {
      const email = emailList[countEmail].email;
      const password = emailList[countEmail].password;
      console.log(`Run email: ${email}`);

      await page.goto("https://accounts.google.com", {
        timeout: 30000,
        waitUntil: "networkidle0",
      });

      const response = await checkLogin(page, email, password);
      console.log(response);

      // if (response.susscess == 1) {
      //   // await page.goto("https://mail.google.com/mail/u/0/#inbox", {
      //   //   timeout: 30000,
      //   //   waitUntil: "networkidle0",
      //   // });
      //   await page.close();
      //   await delay(1000);
      // } else {
      //   //await page.close();
      //   await delay(3000);
      // }
      return await runLogin(page, countEmail + 1, emailList);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Count email test:" + countEmail);
    //await hidemyacc.stop(profileId);
  }
}

module.exports = runLogin;
