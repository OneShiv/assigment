import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import {
  GET_GLOBAL_QUOTE,
  GET_STOCK_OVERVIEW,
  GET_STOCK_INTRADAY,
  INTERVAL_ONE_HOUE,
} from "../../../api/constants";
import { transformStockIntradayForChart } from "../../../utils";
import { fetch } from "../../../api";
import { IconButton } from "@mui/material";
import Refresh from "@mui/icons-material/Refresh";
import Stop from "@mui/icons-material/Stop";
import { GlobalQuoteResp, IntraDayResponse, StockOverview } from "./types";
import { LineChartData } from "../../charts/LineChart/types";
import LabelValue from "../../common/LabelValue";
import LineChart from "../../charts/LineChart";
import Card from "../../common/Card";

function StockDetails() {
  const params = useParams();
  const [refreshInterval, setRefreshInterval] = React.useState(0);
  const [isAutoRefreshOn, setAutoRefreshOn] = React.useState(false);

  const {
    data: stockOverview,
    error: stockOverviewError,
    isLoading: stockOverviewLoading,
  } = useSWR<StockOverview, Error>(
    params.id ? `${GET_STOCK_OVERVIEW}&symbol=${params.id}` : null,
    () => fetch(GET_STOCK_OVERVIEW, `&symbol=${params.id}`)
  );

  console.log(
    "stock overview",
    stockOverviewError,
    stockOverviewLoading,
    stockOverview
  );
  const {
    data: stockIntradayData,
    error: stockIntradayDataError,
    isLoading: stockIntradayDataLoading,
  } = useSWR<IntraDayResponse, Error>(
    params.id
      ? `${GET_STOCK_INTRADAY}${INTERVAL_ONE_HOUE}&symbol=${params.id}`
      : null,
    () => fetch(GET_STOCK_INTRADAY, `${INTERVAL_ONE_HOUE}&symbol=${params.id}`),
    refreshInterval && isAutoRefreshOn
      ? { refreshInterval: refreshInterval }
      : undefined
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

  if (
    stockIntradayDataLoading ||
    stockIntradayDataLoading ||
    globalQuoteLoading
  ) {
    return <div>Loading ...</div>;
  }
  if (stockOverviewError || stockIntradayDataError || globalQuoteError) {
    return <div>Oops some Error Occured !</div>;
  }

  if (!stockOverview || stockIntradayData?.Note || globalQuoteData?.Note) {
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
    <Card>
      {stockOverview && (
        <>
          <div className="stock-heading">
            <h2>
              {stockOverview.Name} ({stockOverview.Symbol})
            </h2>
            <p>{stockOverview.Description}</p>
          </div>
          {stockIntradayData && globalQuoteData && (
            <section className="stock-chart">
              <section className="refresh-data">
                <div className="inputs">
                  <span>Refresh after(sec):</span>
                  <input
                    className="refresh-interval-input"
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
                </div>
                <p>
                  <em>
                    Chart Last Sync :
                    {stockIntradayData["Meta Data"]["3. Last Refreshed"]}
                  </em>
                </p>
              </section>
              <LineChart data={data} data-test-id="line-chart" />
            </section>
          )}
          <h3>More Details :</h3>
          <section className="stock-details-data">
            <LabelValue
              label="Current Price"
              value={
                globalQuoteData
                  ? `$${globalQuoteData["Global Quote"]["05. price"]}`
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
        </>
      )}
    </Card>
  );
}

export default StockDetails;
