const api_keys = require('./api_keys')

exports.getKeys = () => {
  console.log(api_keys)
}

exports.requestOptTicker = (ticker, number) => { 
  return  {
    method: 'POST',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/list',
    params: { s: ticker, region: 'IT', snippetCount: number },
    headers: {
        'content-type': 'text/plain',
        'x-rapidapi-key': '7c3ccbf7ccmsh1195eaa304e9cb0p15ee6fjsn7998087d2742',
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
        'x-rapidapi-key': '7c3ccbf7ccmsh1195eaa304e9cb0p15ee6fjsn7998087d2742',
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };
}