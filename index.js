const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const website =
  "https://www.healthywa.wa.gov.au/Articles/A_E/Coronavirus/Locations-visited-by-confirmed-cases";

const port = 3000;
app.use(cors());

try {
  axios(website).then((res) => {
    const data = res.data;
    // Loads the HTML.
    const $ = cheerio.load(data);

    // Array to store the exposure sites data. Contains the headings at the start.
    const exposureSites = [
      [
        "Exposure date and time",
        "Suburb",
        "Location",
        "Date Updated",
        "Health Advice",
      ],
    ];
    // Loop through the tr elements in the tbody.
    $("#locationTable > tbody > tr").each((index, element) => {
      // Returns and stores an array of td DOM elements.
      const tds = $(element).find("td");
      // Stores the relevant table data into variables.
      const exposureDateAndTime = $(tds[1]).text();
      const suburb = $(tds[2]).text();
      const location = $(tds[3]).text();
      const dateUpdated = $(tds[4]).text();
      const healthAdvice = $(tds[5]).text();

      // Stores the variables into an array.
      const tableRow = [
        exposureDateAndTime,
        suburb,
        location,
        dateUpdated,
        healthAdvice,
      ];

      // Adds the table row array to the exposure sites array.
      exposureSites.push(tableRow);
    });

    app.get("/", (req, res) => {
      res.json(exposureSites);
    });
  });
} catch (error) {
  console.log(error, error.message);
}

app.listen(process.env.PORT || port, () => {
  console.log("Now listening on port 3000");
});
