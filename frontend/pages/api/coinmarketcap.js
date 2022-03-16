const CoinMarketCap = require('coinmarketcap-api');

export default async function handler(req, res) {
  try {
    const apiKey = process.env.COINMARKETCAP_API_KEY;
    console.log('[apiKey]', apiKey);
    const client = new CoinMarketCap(apiKey);
    
    const result = await client.getTickers();
    console.log('[result]', result);
    const ethPrice = result.data?.find(item => item.name === "Ethereum")?.quote.USD.price;
  
    res.status(200).json({ eth: ethPrice, status: 'ok' });
  }
  catch (err) {
    console.log('[err]', err);
    res.status(500).json({ status: 'API ERROR' });
  }
}
