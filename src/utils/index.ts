import { IntraDayResponse, StockSeries } from "../modules/stocks/Details/types";
import { Stock } from "../modules/stocks/SearchLayout/types";

export const transformStockIntraDayDataForChart = (
  intraDayDataResp: IntraDayResponse | undefined
) => {
  const intraDayData =
    intraDayDataResp && intraDayDataResp["Time Series (60min)"];

  if (
    !intraDayDataResp ||
    !intraDayData ||
    Object.keys(intraDayData).length === 0
  ) {
    return {
      data: [],
      labels: [],
    };
  }
  let timelyData: StockSeries = intraDayData;
  let timeKeys = Object.keys(timelyData);
  let firstDateDay = new Date(timeKeys[0]).getDay();
  let newTimeSeries: StockSeries = {};
  newTimeSeries[timeKeys[0]] = timelyData[timeKeys[0]];
  for (let i = 1; i < timeKeys.length; i++) {
    let readingDate = new Date(timeKeys[i]).getDay();
    if (firstDateDay != readingDate) {
      break;
    }
    newTimeSeries[timeKeys[i]] = timelyData[timeKeys[i]];
  }

  const labels = Object.keys(newTimeSeries).map(
    (key) => `${new Date(key).getHours()}`
  );
  const data = Object.entries(newTimeSeries).map((data) => data[1]["4. close"]);
  return {
    data,
    labels,
  };
};

export const stocksDataTransformer = (stocks: Stock[]) => {
  return stocks.map((stock: Stock) => ({
    symbol: stock["1. symbol"],
    label: `${stock["1. symbol"]} | ${stock["2. name"]}`,
  }));
};
