require('dotenv').config();

const axios = require('axios');
const fs = require('fs');
const recursive = require('recursive-fs');
const FormData = require('form-data');
const basePathConverter = require('base-path-converter');

const upload10k = async() => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const src = './json';

  recursive.readdirr(src, function (err, dirs, files) {
    let data = new FormData();
    files.forEach((file) => {
      //for each file stream, we need to include the correct relative file path
      data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(src, file)
      });
    });

    axios.post(url, data, {
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: process.env.API_KEY,
        pinata_secret_api_key: process.env.API_SEC
      }
    })
    .then(function (response) {
      console.log(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  });
}

const rename = async() => {
  const src = './json';
  recursive.readdirr(src, function (err, dirs, files) {
    files.forEach((file) => {
      var name = file.split("/");
      name = name[name.length-1];
      if (Number(name) > 0) {
        fs.rename(file, './json/'+Number(name), function(err) {});
      }
    });
  });
}

// upload10k();
rename();