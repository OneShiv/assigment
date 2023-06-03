export type StockOverview = {
  Name: string;
  Symbol: string;
  Description: string;
  CurrentPrice: string;
  ChangeTradedOn: string;
  Industry: string;
  PERatio: string;
  MarketCapitalization: string;
};

export type GlobalQuote = {
  "01. symbol": string;
  "02. open": string;
  "03. high": string;
  "04. low": string;
  "05. price": string;
  "06. volume": string;
  "07. latest trading day": string;
  "08. previous close": string;
  "09. change": string;
  "10. change percent": string;
};

export type StockIntraDay = {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
};

export type StockSeries = {
  [key: string]: StockIntraDay;
};

export type IntraDayResponse = {
  "Time Series (60min)": StockSeries;
};
