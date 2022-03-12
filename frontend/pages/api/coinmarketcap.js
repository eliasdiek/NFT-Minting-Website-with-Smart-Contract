const CoinMarketCap = require('coinmarketcap-api');

export default async function handler(req, res) {
  try {
    const apiKey = process.env.COINMARKETCAP_API_KEY;
    const client = new CoinMarketCap(apiKey);
    
    const result = await client.getTickers();
    const ethPrice = result.data.filter(item => item.name === "Ethereum")[0]?.quote.USD.price;
  
    res.status(200).json({ eth: ethPrice, status: 'ok' });
  }
  catch (err) {
    console.log('[err]', err);
    res.status(500).json({ status: 'API ERROR' });
  }
}
