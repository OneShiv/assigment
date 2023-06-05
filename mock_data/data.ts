export const overViewData = {
  Symbol: "NVDA",
  AssetType: "Common Stock",
  Name: "NVIDIA Corporation",
  Description:
    "Nvidia Corporation is an American multinational technology company incorporated in Delaware and based in Santa Clara, California. It designs graphics processing units (GPUs) for the gaming and professional markets, as well as system on a chip units (SoCs) for the mobile computing and automotive market.",
  CIK: "1045810",
  Exchange: "NASDAQ",
  Currency: "USD",
  Country: "USA",
  Sector: "MANUFACTURING",
  Industry: "SEMICONDUCTORS & RELATED DEVICES",
  Address: "2701 SAN TOMAS EXPRESSWAY, SANTA CLARA, CA, US",
  FiscalYearEnd: "January",
  LatestQuarter: "2023-04-30",
  MarketCapitalization: "971376951000",
  EBITDA: "6090000000",
  PERatio: "205.9",
  PEGRatio: "4.041",
  BookValue: "9.91",
  DividendPerShare: "0.16",
  DividendYield: "0.0004",
  EPS: "1.91",
  RevenuePerShareTTM: "10.44",
  ProfitMargin: "0.185",
  OperatingMarginTTM: "0.174",
  ReturnOnAssetsTTM: "0.0627",
  ReturnOnEquityTTM: "0.189",
  RevenueTTM: "25878000000",
  GrossProfitTTM: "15356000000",
  DilutedEPSTTM: "1.91",
  QuarterlyEarningsGrowthYOY: "0.281",
  QuarterlyRevenueGrowthYOY: "-0.132",
  AnalystTargetPrice: "443.2",
  TrailingPE: "205.9",
  ForwardPE: "39.53",
  PriceToSalesRatioTTM: "14.79",
  PriceToBookRatio: "19.59",
  EVToRevenue: "14.59",
  EVToEBITDA: "56.0",
  Beta: "1.768",
  "52WeekHigh": "419.38",
  "52WeekLow": "108.08",
  "50DayMovingAverage": "293.45",
  "200DayMovingAverage": "200.37",
  SharesOutstanding: "2470000000",
  DividendDate: "2023-06-30",
  ExDividendDate: "2023-06-07",
};

const date = new Date(Date.now());
const d1 = date;
const d2 = new Date(Date.now() - 86400000);
const d3 = new Date(Date.now() - 86400000 * 2);
const originalData = {
  [d1.toDateString()]: {
    "1. open": "132.3000",
    "2. high": "132.3000",
    "3. low": "132.3000",
    "4. close": "132.3000",
    "5. volume": "252",
  },
  [d2.toDateString()]: {
    "1. open": "132.3000",
    "2. high": "132.3000",
    "3. low": "132.3000",
    "4. close": "132.3000",
    "5. volume": "775",
  },
  [d3.toDateString()]: {
    "1. open": "132.3000",
    "2. high": "132.3000",
    "3. low": "132.3000",
    "4. close": "132.3000",
    "5. volume": "926",
  },
};

export const intraDayData = {
  "Meta Data": {
    "3. Last Refreshed": "03-02-2023 00:00:00",
  },
  "Time Series (60min)": originalData,
};

export const globalQuote = {
  "Global Quote": {
    "01. symbol": "TSLA",
    "02. open": "210.1500",
    "03. high": "217.2500",
    "04. low": "209.7520",
    "05. price": "213.9700",
    "06. volume": "164398372",
    "07. latest trading day": "2023-06-02",
    "08. previous close": "207.5200",
    "09. change": "6.4500",
    "10. change percent": "3.1081%",
  },
};
