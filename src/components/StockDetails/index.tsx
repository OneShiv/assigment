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

function StockDetails() {
  const params = useParams();
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
  console.log(stockIntradayData, globalQuoteData);

  

  if (getStocksLoading || stockIntradayDataLoading || globalQuoteLoading) {
    return <div>Loading ...</div>;
  }

  if (getStocksLoading || stockIntradayData?.Note || globalQuoteData?.Note) {
    return <div>API limit exhausted</div>;
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
        label: "legend1",
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
          <h2>Stock Details</h2>
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
