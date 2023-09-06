const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
const API_KEY = 'umZEqICZSHCfh7IQRl6KRpgR2LiouHORozc7ZzXM';
app.use(express.static('public'));

app.get('/asteroids', async (req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`);
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send('Error occured while fetching data from NASA API', error)
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));