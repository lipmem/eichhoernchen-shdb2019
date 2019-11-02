const axios = require("axios");
const fs = require("fs");

function scrape() {
  for (let i = 1; i < 685; i++) {
    setTimeout(() => {
      request(i);
    }, i * 20);
  }
}

function request(i) {
  axios
    .get(
      "https://trees.codefor.de/api/trees/?dist=1000&page=" +
        i +
        "&point=13.428948,52.499029"
    )
    .then(function(response) {
      // handle success
      let data = JSON.stringify(response.data.features)
        .substr(1)
        .slice(0, -1);
      fs.appendFile("1km", data + ",", function(err) {
        if (err) throw err;
        console.log("Saved!");
      });
    })
    .catch(err => {
      console.log("ERROR");
      console.log("Retry");
      request(i);
    });
}

scrape();
// for (let i = 1; i < 327; i++) {
//   axios
//     .get(
//       "https://trees.codefor.de/api/v2/trees/?dist=1000&page=" +
//         i +
//         "&point=13.428948,52.499029"
//     )
//     .then(function(response) {
//       for (let feat of response.data.features) {
//         let tree = { [feat.id]: feat.geometry.coordinates };
//         fs.appendFile(
//           "1kmraw.json",
//           JSON.stringify(tree)
//             .substr(1)
//             .slice(0, -1) + ",\n",
//           function(err) {
//             if (err) throw err;
//             console.log("Saved!");
//           }
//         );
//       }
//     })
//     .catch(err => console.log(err));
// }
