const apiKey = require("../secrets/apiKeys.json");

const APIConfig = {
  alpha: {
    key: "&apikey=" + apiKey.alpha,
    url: "https://www.alphavantage.co/",
    full: "&outputsize=full",
    FX1: "query?function=FX_DAILY&from_symbol=",
    FX2: "&to_symbol=USD",
    crypto1: "query?function=DIGITAL_CURRENCY_DAILY&symbol=",
    crypto2: "&market=USD",
    stock: "query?function=TIME_SERIES_WEEKLY&symbol=",
  },
  quandl: {
    key: "/data.json?&api_key=" + apiKey.quandl,
    url: "https://www.quandl.com/api/v3/datasets/LBMA/",
    start: "&start_date=2018-08-01",
  },
  coinapi: {
    url: "https://rest.coinapi.io/v1/exchangerate/",
    key: "/USD?apikey=" + apiKey.coinapi,
  },
  metalsapi: {
    url: "https://www.metals-api.com/api/latest?access_key=" + apiKey.metalsapi,
  },
};

module.exports = APIConfig;
