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

String.prototype.format = function () {
  const args = arguments;
  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
};

const evaluateNumberStar = ["1", "2", "3", "4", "5"];
const numberStar =
  evaluateNumberStar[Math.floor(Math.random() * evaluateNumberStar.length)];
const selector = 'input[value="{0}"]'.format(numberStar);
console.log(selector);
