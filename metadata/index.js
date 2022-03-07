var express = require('express');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
var app = express();

dotenv.config();

let rawdata = fs.readFileSync('../build/contracts/FathomyachtClub.json',);
let contract_abi = JSON.parse(rawdata);

var mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST+'/'+process.env.DB_NAME, {useNewUrlParser: true, useUnifiedTopology: true})
var mongoDB = mongoose.connection;
const models = require('./models');

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
const ipfs_prefix = process.env.IPFS_PEF;

const Web3 = require('web3');
const web3 = new Web3("wss://rinkeby.infura.io/ws/v3");
var FathomyachtClub = new web3.eth.Contract(contract_abi.abi, '0xbF57863aB1aF9F11C1faF2D4eA385E884a6ffD21');

mongoDB.once('open', function() {
    console.log('--  MogoDB Connected  --');
});

const port = process.env.PORT || 3000;

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

const pinFileToIPFS = async (fileStream, options) => {
    const result = await pinata.pinFileToIPFS(fileStream, options);

    return result;
}

const pinJsonToIPFS = async (body, options) => {
    const result = await pinata.pinJSONToIPFS(body, options);
    return result;
}

const init = async () => {
    const directoryPath = path.join('./data', 'meta');
    await models.metadata.deleteMany({});

    console.log('[----------------------------------------]');

    await fs.readdir(directoryPath, function async (err, files) {
        if (err) {
            return console.log('[Unable to scan directory]', err);
        }

        files.forEach(function async (file, index) {
            const filePath = path.join(directoryPath, file);

            fs.readFile(filePath, async function(err, data) {
                if (err) {
                    return console.log('[Unable to read file]', err);
                }

                const metaData = JSON.parse(data);
                const tokenNumber = parseInt(metaData.tokenId);
                var subDirectory = '';

                if (tokenNumber > 0 && tokenNumber <= 2000) {
                    subDirectory = 'Yacht';
                }
                else if (tokenNumber > 2000 && tokenNumber <= 4000) {
                    subDirectory = 'Prestige';
                }
                else if (tokenNumber > 4000 && tokenNumber <= 6000) {
                    subDirectory = 'Ultra';
                }
                else if (tokenNumber > 6000 && tokenNumber <= 8000) {
                    subDirectory = 'Reserve';
                }
                else if (tokenNumber > 8000 && tokenNumber <= 10000) {
                    subDirectory = 'Power';
                }

                const imagePath = path.join('./data/images', subDirectory, 'Images', metaData.tokenId + '.png');

                const readableStreamForImage = fs.createReadStream(imagePath);
                const result = await pinFileToIPFS(readableStreamForImage, {});
                const imageUrl = ipfs_prefix + result.IpfsHash;
                metaData.image = imageUrl;
                const jsonOptions = {
                    pinataMetadata: {
                        name: metaData.tokenId
                    },
                    pinataOptions: {
                        cidVersion: 0
                    }
                };
                const resultForJson = await pinJsonToIPFS(metaData, jsonOptions);
                const jsonUrl = ipfs_prefix + resultForJson.IpfsHash;

                var metaDataCollection = new models.metadata();
                metaDataCollection.tokenId = metaData.tokenId;
                metaDataCollection.jsonHash = resultForJson.IpfsHash;
            
                await metaDataCollection.save();

                console.log('[file]', index, metaData.tokenId, resultForJson);
            });
        });
    });

    return 'ok';
}

const setTokenURI = async(_tokenId, _tokenURI) => {
    var result = await FathomyachtClub.methods.setTokenURI(_tokenId, _tokenURI).send({ from: "0x580d2Ddb6ED71c23059D5d83891D525A3B750A2b", gas:500000 })
    console.log(result)
};

app.get("/", (req, res) =>
  res.send(
    '<h1 style="width: 100%; text-align: center; margin-top: 40vh; color: #f34eff; font-size: 62px;">Fathom Yacht Club</h1>'
  )
);

app.get('/api/init', async function(req, res) {
    const initData = await init();

    res.json({ status: 'success' });
});

app.post('/api/set_token_uri', async function(req, res) {
    const tokenId = req.body.tokenId;
    if (!!!tokenId) {
        res.json({ status: 'error' });
        return;
    }

    const metaData = await models.metadata.findOne({tokenId: tokenId});
    const tokenURI = ipfs_prefix + metaData.jsonHash;
    await setTokenURI(tokenId, tokenURI);

    console.log('[tokenId]', tokenURI);
    res.json({ status: 'success' });
});

app.listen(port, function () {
    console.log(`🚀 Running app on port ${port}`);
});
  