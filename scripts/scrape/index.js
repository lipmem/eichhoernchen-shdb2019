const axios = require("axios");
const fs = require("fs");

for (let i = 1; i < 641; i++) {
  axios
    .get(
      "https://trees.codefor.de/api/v2/trees/?dist=2000&page=" +
        i +
        "&point=13.381018%2C52.498606"
    )
    .then(function(response) {
      // handle success
      let data = JSON.stringify(response.data.features)
        .substr(1)
        .slice(0, -1);
      fs.appendFile("data", data + ",", function(err) {
        if (err) throw err;
        console.log("Saved!");
      });
    })
    .catch(err => console.log(err));
}
