import {
  stocksDataTransformer,
  transformStockIntradayForChart,
} from "../../src/utils";
describe("[Function : StocksDataTransformer]", () => {
  it("should return empty array if function provided with empty array", () => {
    expect(stocksDataTransformer([])).toHaveLength(0);
  });

  it("should return correct data with transfomed values", () => {
    const originalData = [
      {
        "1. symbol": "TS",
        "2. name": "Tenaris S.A.",
        "3. type": "Equity",
        "4. region": "United States",
        "5. marketOpen": "09:30",
        "6. marketClose": "16:00",
        "7. timezone": "UTC-04",
        "8. currency": "USD",
        "9. matchScore": "1.0000",
      },
      {
        "1. symbol": "TS3E.DEX",
        "2. name": "TS3E",
        "3. type": "ETF",
        "4. region": "XETRA",
        "5. marketOpen": "08:00",
        "6. marketClose": "20:00",
        "7. timezone": "UTC+02",
        "8. currency": "EUR",
        "9. matchScore": "0.66",
      },
    ];

    const expectedValue = [
      {
        symbol: "TS",
        id: "TS",
        label: "TS | Tenaris S.A.",
      },
      {
        symbol: "TS3E.DEX",
        id: "TS3E.DEX",
        label: "TS3E.DEX | TS3E",
      },
    ];
    expect(stocksDataTransformer(originalData)).toEqual(expectedValue);
    expect(stocksDataTransformer(originalData).length).toEqual(
      expectedValue.length
    );
  });
});

describe("[Function : transformStockIntradayForChart]", () => {
  it("should return empty array if intraday trades data is empty", () => {
    expect(
      transformStockIntradayForChart({
        "Meta Data": {
          "3. Last Refreshed": "03-02-2023 00:00:00",
        },
        "Time Series (60min)": {},
      })
    ).toEqual({
      labels: [],
      data: [],
    });
  });

  it("should return only data for the day who's records matches with today's date and this data will be always less than actual data", () => {
    const date = new Date(Date.now());

    const d1 = date;
    const d2 = new Date(Date.now() - 86400000);
    const d3 = new Date(Date.now() - 86400000 * 2);
    const originalData = {
      "Meta Data": {
        "3. Last Refreshed": "03-02-2023 00:00:00",
      },
      "Time Series (60min)": {
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
      },
    };
    const expectedValue = transformStockIntradayForChart(originalData);
    expect(expectedValue.labels.length).toBeLessThan(
      Object.keys(originalData).length
    );
  });
});
