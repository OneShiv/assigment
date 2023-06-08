import { useParams } from "react-router-dom";
import useSWR from "swr";
import { GET_STOCK_INTRADAY, INTERVAL_ONE_HOUE } from "../../../api/constants";
import { fetch } from "../../../api";
import { IconButton } from "@mui/material";
import Refresh from "@mui/icons-material/Refresh";
import Stop from "@mui/icons-material/Stop";
import { GlobalQuoteResp, IntraDayResponse } from "./types";
import LineChartHoc from "../../../hocs/LineChartHoc";
import React from "react";

function LineChartWrapper({globalQuoteData}:{globalQuoteData?:GlobalQuoteResp}) {
  const [refreshInterval, setRefreshInterval] = React.useState(0);
  const [isAutoRefreshOn, setAutoRefreshOn] = React.useState(false);

  const params = useParams();

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

  if (stockIntradayDataLoading) {
    return <div>Loading ...</div>;
  }

  if (!stockIntradayData || stockIntradayData["Error Message"]) {
    console.log("here");
    return <div>No data for this search result</div>;
  }

  if (stockIntradayDataError) {
    return <div>Oops some Error Occured !</div>;
  }

  if (stockIntradayData?.Note) {
    return (
      <div>
        <p>API limit exhausted</p>
      </div>
    );
  }
  return (
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
            <IconButton color="primary" onClick={() => setAutoRefreshOn(true)}>
              <Refresh />
            </IconButton>
          )}
          {isAutoRefreshOn && (
            <IconButton color="primary" onClick={() => setAutoRefreshOn(false)}>
              <Stop />
            </IconButton>
          )}
        </div>
        <p>
          <em>
            Chart Last Sync :
            {stockIntradayData
              ? stockIntradayData["Meta Data"]["3. Last Refreshed"]
              : "-"}
          </em>
        </p>
      </section>
      <LineChartHoc
        primaryData={stockIntradayData}
        secondaryData={globalQuoteData}
      />
    </section>
  );
}

export default LineChartWrapper