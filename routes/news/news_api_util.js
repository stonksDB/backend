exports.requestOptTicker = (ticker, number) => { 
  return  {
    method: 'POST',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/list',
    params: { s: ticker, region: 'IT', snippetCount: number },
    headers: {
        'content-type': 'text/plain',
        'x-rapidapi-key': 'Dzzd2zsPGXmshEw7W0fIiNYZklJZp1ebqsmjsnrFbX2oNhRmND',
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
        'x-rapidapi-key': 'Dzzd2zsPGXmshEw7W0fIiNYZklJZp1ebqsmjsnrFbX2oNhRmND',
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };
}