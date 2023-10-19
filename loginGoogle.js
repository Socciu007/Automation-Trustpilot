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

// de quy login
async function runLogin(page, countEmail, emailList) {
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
