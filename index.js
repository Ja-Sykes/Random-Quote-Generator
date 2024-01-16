//// My FIRST node.js and ejs APP using API's!!!
// Had fun learning about this. The Web Dev course taught by Angela Yu was really confusing and didn't go too much into detail (I learned from there)
//Therfore leading to lots of help from ChatGPT and googling.

import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Create a map to store previously fetched quotes for each genre
const previousQuotes = new Map();

app.get("/", (req, res) => {
  res.render("index.ejs", { data: null, error: null });
});

app.post("/", async (req, res) => {
  try {
    const genre = req.body.genre;

    // Check if the genre has previous quotes
    if (previousQuotes.has(genre) && previousQuotes.get(genre).length > 0) {
      const randomIndex = Math.floor(Math.random() * previousQuotes.get(genre).length);
      const randomQuote = previousQuotes.get(genre)[randomIndex];
      res.render("index.ejs", {
        data: randomQuote,
        error: null,
      });
    } else {
      const response = await axios.get(`https://quote-garden.onrender.com/api/v3/quotes?genre=${genre}`);
      const result = response.data;

      if (result.statusCode === 200 && result.data.length > 0) {
        // Store the fetched quote in the map
        previousQuotes.set(genre, result.data);

        res.render("index.ejs", {
          data: result.data[0],
          error: null,
        });
      } else {
        res.render("index.ejs", {
          data: null,
          error: "No quotes available for the selected genre.",
        });
      }
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      data: null,
      error: "Failed to fetch quotes. Please try again later.",
    });
  }
});

app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
