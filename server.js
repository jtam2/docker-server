// import express (after npm install express)
const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require('child_process');
require('dotenv').config()
const axios = require('axios');

const app = express();

// server configuration
const PORT = 8000;

// Midddleware
app.use(cors());
app.use(bodyParser.json());

// create a route for the app
app.post('/docker', (req, res) => {

  let data = req.body
  let artifactLocation = data.artifactLocation
  let name = data.name
  console.log(req)
  if (data.artifactLocation[data.artifactLocation.length - 1] !== '/'){
    artifactLocation = data.artifactLocation + '/'
  }
  let ecrURL = data.ecrURL
  if (data.ecrURL[data.ecrURL.length-1] === '/'){
    ecrURL = data.ecrURL.substring(0, data.ecrURL.length -1)
  }
  const myShellScript = exec(`sh ./build_docker.sh ${artifactLocation} ${name.toLowerCase()} ${ecrURL} us-east-1 > logs.txt`, (error, stdout, stderr) => {
    axios.post(`${MLFLOW_HOSTER_URL}/deploy-webhook`, {ecrUrl: data.ecrURL,name: data.name})
  });
  res.send("STARTED the process");
  return;
});

// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);  
});


