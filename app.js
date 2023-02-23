const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const https = require('https')
const apiKey = "7T3wpEqZueQiUDV0xuO1pJhqM50aDO1c2Po7VgbS";
const getDataFromNASAAPI = apiKey => {
    return new Promise((resolve, reject) => {
        https.get(
            `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`,
            response => {
                let data = "";
                response.on("data", chunk => {
                    data += chunk;
                });
                response.on("end", () => {
                    resolve(JSON.parse(data));
                });
            }
        ).on("error", error => {
            reject(error);
        });
    });
};

app.get("/apod", async (req, res) => {
    const data = await getDataFromNASAAPI(apiKey);
    const image = data.url;
    const description = data.explanation;
    res.send(`<link rel="stylesheet" type="text/css" href="/style.css">
    <img class="apod-image" src="${image}" alt="APOD image">
    <p class="apod-description">${description}</p>`)
});


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


app.listen(PORT, () => {
    console.log("Lyssnar på PORT: " + PORT)
})

app.use(express.static(__dirname));