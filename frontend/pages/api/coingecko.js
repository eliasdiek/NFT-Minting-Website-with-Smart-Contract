const CoinGecko = require('coingecko-api');

export default async function handler(req, res) {
    try {
        const CoinGeckoClient = new CoinGecko();

        let data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
            coin_ids: ['ethereum']
        });
        const ethPrice = data.data.tickers.filter(ticker => ticker.target === 'USD')[0]?.last;
    
        res.status(200).json({ eth: ethPrice, status: 'ok' });
    }
    catch (err) {
        console.log('[err]', err);
        res.status(500).json({ status: 'API ERROR' });
    }
}
  