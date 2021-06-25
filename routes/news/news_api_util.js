const api_keys = require('./api_keys')

const randomIndex = (max) => {
  return Math.floor(Math.random() * max);
}

exports.getRandomKey = () => { 
  const ix = randomIndex(2)
  return api_keys[randomIndex(2)];
}

exports.requestOptTicker = (ticker, number) => { 
  return  {
    method: 'POST',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/list',
    params: { s: ticker, region: 'IT', snippetCount: number },
    headers: {
        'content-type': 'text/plain',
        'x-rapidapi-key': this.getRandomKey(),
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    },
  };
}

exports.requestOptUuid = (uuid) => { 
  return  {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/get-details',
    params: { uuid: uuid, region: 'IT' },
    headers: {
        'x-rapidapi-key': this.getRandomKey(),
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };
}