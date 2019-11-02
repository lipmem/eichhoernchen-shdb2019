const axios = require("axios");
const fs = require("fs");

function scrape() {
  for (let i = 1; i < 327; i++) {
    axios
      .get(
        "https://trees.codefor.de/api/v2/trees/?dist=1000&page=" +
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
      .catch(err => console.log(err));
  }
}

scrape();

// for (let i = 1; i < 641; i++) {
//   axios
//     .get(
//       "https://trees.codefor.de/api/v2/trees/?dist=2000&page=" +
//         i +
//         "&point=13.381018%2C52.498606"
//     )
//     .then(function(response) {
//       for (let feat of response.data.features) {
//         let tree = { [feat.id]: feat.geometry.coordinates };
//         fs.appendFile(
//           "trees.json",
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
