const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');

dotenv.config();

const imageBatchURI = "https://gateway.pinata.cloud/ipfs/QmSSGFwHzneUFom4taWhMv1MNYNrGUFFQB3VU8rgWZrFNX";

const updateMeta = async () => {
    const directoryPath = path.join('./data', 'meta');
    
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

                const imageURI = `${imageBatchURI}/${subDirectory}/${metaData.tokenId}.png`;

                metaData.image = imageURI;

                fs.writeFile(filePath, JSON.stringify(metaData), function (err) {
                    if (err) throw err;
                    console.log('[Replaced]', metaData);
                });
            });
        });
    });

    return 'ok';
}

updateMeta();