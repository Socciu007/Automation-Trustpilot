// const PublicGoogleSheetsParser = require("public-google-sheets-parser");

// const spreadID = "1g3dGpCUW2W1UiuFyyCZK038GBo1uZbkJ5xU7S5QjOoA";
// const parser = new PublicGoogleSheetsParser(spreadID);

// async function processData() {
//   try {
//     const reviewsFromSheet = await parser.parse(spreadID, "Trust1");
//     const review =
//       reviewsFromSheet[Math.floor(Math.random() * reviewsFromSheet.length)];
//     console.log(review.Comments);
//     console.log(reviewsFromSheet);
//   } catch (error) {
//     console.error(error);
//   }
// }

const url =
  "pictures/anh1.jpg pictures/anh2.jpg pictures/anh3.jpg pictures/anh4.jpg pictures/anh5.jpg pictures/anh6.jpg pictures/anh7.jpg pictures/anh8.jpg pictures/anh9.jpg";
console.log(url.split(" "));

// Tạo một ngày tháng năm ngẫu nhiên trong khoảng từ 1/1/2000 đến 12/31/2025
function createRandomDateWithoutTime() {
  const startYear = 2000;
  const endYear = 2025;

  const year =
    Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 31) + 1;

  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const maxDaysInMonth = [
    0,
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  if (day > maxDaysInMonth[month]) {
    return createRandomDateWithoutTime();
  }

  const date = new Date(year, month - 1, day, 0, 0, 0, 0); // Thời gian 0 giờ, 0 phút, 0 giây, 0 mili giây

  return date;
}

const randomDate = createRandomDateWithoutTime();
console.log(randomDate);
