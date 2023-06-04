import {
  IntraDayResponse,
  StockSeries,
} from "../components/StockDetails/types";
import { Stock } from "../components/StockSearchLayout/types";

export const transformStockIntradayForChart = (
  intraDayDataResp: IntraDayResponse | undefined
) => {
  const intraDayData =
    intraDayDataResp && intraDayDataResp["Time Series (60min)"];
  if (!intraDayDataResp || !intraDayData) {
    return {
      data: [],
      labels: [],
    };
  }
  let intraDayTimeKeys = Object.keys(intraDayData);
  let todaysData = [];
  let currentDay = new Date();
  let daysToSubtract = 0;

  // considering markets are closed on saturday and sunday
  if (currentDay.getDay() == 6) {
    daysToSubtract = 1;
  } else if (currentDay.getDay() == 7) {
    daysToSubtract = 1;
  }
  for (let i = 0; i < intraDayTimeKeys.length; i++) {
    let timeKey = intraDayTimeKeys[i];
    let readingTime = new Date(timeKey);
    console.log(currentDay.getDate(), daysToSubtract, readingTime.getDate());
    if (currentDay.getDate() - daysToSubtract == readingTime.getDate()) {
      todaysData.push({
        ...intraDayData[timeKey],
        date: `${readingTime.getHours()}`,
      });
    }
  }

  const labels = todaysData.map((data) => data.date);
  const data = todaysData.map((data) => data["4. close"]);
  return {
    data,
    labels,
  };
};

export const stocksDataTransformer = (stocks: Stock[]) => {
  return stocks.map((stock: Stock) => ({
    symbol: stock["1. symbol"],
    id: stock["1. symbol"],
    label: `${stock["1. symbol"]} | ${stock["2. name"]}`,
  }));
};
