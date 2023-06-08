import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import {
  GET_GLOBAL_QUOTE,
  GET_STOCK_OVERVIEW,
  GET_STOCK_INTRADAY,
  INTERVAL_ONE_HOUE,
} from "../../../api/constants";
import { fetch } from "../../../api";
import { IconButton } from "@mui/material";
import Refresh from "@mui/icons-material/Refresh";
import Stop from "@mui/icons-material/Stop";
import { GlobalQuoteResp, IntraDayResponse, StockOverview } from "./types";
import LabelValue from "../../common/LabelValue";
import Card from "../../common/Card";
import LineChartHoc from "../../../hocs/LineChartHoc";

function checkFallbackUI({
  stockIntradayDataLoading,
  stockIntradayData,
  stockIntradayDataError,
  globalQuoteData,
  globalQuoteError,
  globalQuoteLoading,
  stockOverview,
  stockOverviewLoading,
  stockOverviewError,
}: any) {
  console.log({
    stockIntradayDataLoading,
    stockIntradayData,
    stockIntradayDataError,
    globalQuoteData,
    globalQuoteError,
    globalQuoteLoading,
    stockOverview,
    stockOverviewLoading,
    stockOverviewError,
  });
}

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
    () => {
      console.log("hello");
      return fetch(GET_STOCK_OVERVIEW, `&symbol=${params.id}`);
    },
    {
      revalidateOnFocus: false,
    }
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
      ? { refreshInterval: refreshInterval, revalidateOnFocus: false }
      : { revalidateOnFocus: false }
  );

  const {
    data: globalQuoteData,
    error: globalQuoteError,
    isLoading: globalQuoteLoading,
  } = useSWR<GlobalQuoteResp, Error>(
    params.id ? `${GET_GLOBAL_QUOTE}&symbol=${params.id}` : null,
    () => fetch(GET_GLOBAL_QUOTE, `&symbol=${params.id}`),
    {
      revalidateOnFocus: false,
    }
  );

  console.log(stockOverview, stockIntradayData, globalQuoteData);

  // checkFallbackUI({
  //   stockOverview,
  //   stockOverviewLoading,
  //   stockOverviewError,
  //   globalQuoteData,
  //   globalQuoteLoading,
  //   globalQuoteError,
  //   stockIntradayData,
  //   stockIntradayDataError,
  //   stockIntradayDataLoading,
  // });
  if (stockOverviewLoading || stockIntradayDataLoading || globalQuoteLoading) {
    return <div>Loading ...</div>;
  }

  if (
    !stockOverview ||
    !globalQuoteData ||
    !stockIntradayData ||
    stockOverview["Error Message"] ||
    globalQuoteData["Error Message"] ||
    stockIntradayData["Error Message"]
  ) {
    console.log("here");
    return <div>No data for this search result</div>;
  }

  if (stockOverviewError || stockIntradayDataError || globalQuoteError) {
    return <div>Oops some Error Occured !</div>;
  }

  if (stockOverview?.Note || stockIntradayData?.Note || globalQuoteData?.Note) {
    return (
      <div>
        <p>API limit exhausted</p>
      </div>
    );
  }

  const isDataVisile = !(
    stockOverview?.Note ||
    globalQuoteData?.Note ||
    stockIntradayData?.Note ||
    stockOverview?.["Error Message"] ||
    globalQuoteData?.["Error Message"] ||
    stockIntradayData?.["Error Message"]
  );

  return (
    <Card>
      {isDataVisile && stockOverview && (
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
              <LineChartHoc
                primaryData={stockIntradayData}
                secondaryData={globalQuoteData}
              />
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
