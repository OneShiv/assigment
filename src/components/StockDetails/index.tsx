import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import {
  GET_GLOBAL_QUOTE,
  GET_STOCK_OVERVIEW,
  GET_STOCK_INTRADAY,
  INTERVAL_ONE_HOUE,
} from "../../api/constants";
import { transformStockIntradayForChart } from "../../utils";
import { fetch } from "../../api";
import { StockOverview, IntraDayResponse, GlobalQuoteResp } from "./types";
import StockLineChart from "../StockLineChart";
import LabelValue from "../LabelValue";
import { LineChartData } from "../StockLineChart/types";
import { IconButton } from "@mui/material";
import Refresh from "@mui/icons-material/Refresh";
import Stop from "@mui/icons-material/Stop";

function StockDetails() {
  const params = useParams();
  const [refreshInterval, setRefreshInterval] = React.useState(0);
  const [isAutoRefreshOn, setAutoRefreshOn] = React.useState(false);

  const fetchMetrics = () => {
    // retrieve and then setData()
    console.log("Hello World");
  };

  React.useEffect(() => {
    if (isAutoRefreshOn && refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, isAutoRefreshOn]);

  const {
    data: stockOverview,
    error: getStockError,
    isLoading: getStocksLoading,
  } = useSWR<StockOverview, Error>(
    params.id ? `${GET_STOCK_OVERVIEW}&symbol=${params.id}` : null,
    () => fetch(GET_STOCK_OVERVIEW, `&symbol=${params.id}`)
  );
  console.log(stockOverview);

  const {
    data: stockIntradayData,
    error: stockIntradayDataError,
    isLoading: stockIntradayDataLoading,
  } = useSWR<IntraDayResponse, Error>(
    params.id
      ? `${GET_STOCK_INTRADAY}${INTERVAL_ONE_HOUE}&symbol=${params.id}`
      : null,
    () => fetch(GET_STOCK_INTRADAY, `${INTERVAL_ONE_HOUE}&symbol=${params.id}`)
  );

  const {
    data: globalQuoteData,
    error: globalQuoteError,
    isLoading: globalQuoteLoading,
  } = useSWR<GlobalQuoteResp, Error>(
    params.id ? `${GET_GLOBAL_QUOTE}&symbol=${params.id}` : null,
    () => fetch(GET_GLOBAL_QUOTE, `&symbol=${params.id}`)
  );

  const { labels, data: _data } =
    transformStockIntradayForChart(stockIntradayData);
  console.log(stockIntradayData, globalQuoteData, labels, _data);

  if (getStocksLoading || stockIntradayDataLoading || globalQuoteLoading) {
    return <div>Loading ...</div>;
  }

  if (getStocksLoading || stockIntradayData?.Note || globalQuoteData?.Note) {
    return (
      <div>
        <p>API limit exhausted</p>
      </div>
    );
  }
  const data: LineChartData = {
    labels: labels.reverse(),
    datasets: [
      {
        label: "Last operating day chart",
        data: _data.reverse(),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "previous closing",
        data: globalQuoteData
          ? new Array(_data.length).fill(
              globalQuoteData["Global Quote"]["08. previous close"]
            )
          : [],
        borderDash: [5],
        fill: true,
        borderColor: "rgba(75,16,19,1)",
      },
    ],
  };

  return (
    <section>
      {stockOverview && (
        <>
          <div>
            <h2>Stock Details</h2>
          </div>
          <section className="stock-details">
            <section className="stock-details-data">
              <LabelValue label="Name" value={stockOverview.Name} />
              <LabelValue label="Symbol" value={stockOverview.Symbol} />
              <LabelValue
                label="Description"
                value={stockOverview.Description}
              />
              <LabelValue
                label="Current Price"
                value={
                  globalQuoteData
                    ? globalQuoteData["Global Quote"]["05. price"]
                    : "-"
                }
              />
              <LabelValue
                label="Change its traded on"
                value={
                  globalQuoteData
                    ? globalQuoteData["Global Quote"]["09. change"]
                    : "-"
                }
              />
              <LabelValue label="Industry" value={stockOverview.Industry} />
              <LabelValue label="PE ratio" value={stockOverview.PERatio} />
              <LabelValue
                label="Market Cap"
                value={stockOverview.MarketCapitalization}
              />
            </section>
            {stockIntradayData && globalQuoteData && (
              <section className="stock-chart">
                <section className="refresh-data-inputs">
                  <span>Refresh after(seconds)</span>
                  <input
                    type="number"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRefreshInterval(+e.target.value * 1000)
                    }
                  />
                  {!isAutoRefreshOn && (
                    <IconButton
                      color="primary"
                      onClick={() => setAutoRefreshOn(true)}
                    >
                      <Refresh />
                    </IconButton>
                  )}
                  {isAutoRefreshOn && (
                    <IconButton
                      color="primary"
                      onClick={() => setAutoRefreshOn(false)}
                    >
                      <Stop />
                    </IconButton>
                  )}
                </section>
                <StockLineChart data={data} data-test-id="line-chart" />
              </section>
            )}
          </section>
        </>
      )}
      {getStockError && (
        <section className="stock-details-error">
          <p>Oops! unable to fetch stock details now</p>
          <p>please try after some time or with another symbol search</p>
        </section>
      )}
    </section>
  );
}

export default StockDetails;
