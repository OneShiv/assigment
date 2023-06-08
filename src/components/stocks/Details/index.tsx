import { useParams } from "react-router-dom";
import useSWR from "swr";
import { GET_GLOBAL_QUOTE, GET_STOCK_OVERVIEW } from "../../../api/constants";
import { fetch } from "../../../api";
import { GlobalQuoteResp, StockOverview } from "./types";
import Card from "../../common/Card";
import LineChartWrapper from "./LineChartWrapper";
import MoreDetails from "./MoreDetails";

function StockDetails() {
  const params = useParams();

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
    data: globalQuoteData,
    error: globalQuoteError,
    isLoading: globalQuoteLoading,
  } = useSWR<GlobalQuoteResp, Error>(
    params.id && stockOverview
      ? `${GET_GLOBAL_QUOTE}&symbol=${params.id}`
      : null,
    () => fetch(GET_GLOBAL_QUOTE, `&symbol=${params.id}`),
    {
      revalidateOnFocus: false,
    }
  );

  if (stockOverviewLoading || globalQuoteLoading) {
    return <div>Loading ...</div>;
  }

  if (
    !stockOverview ||
    !globalQuoteData ||
    stockOverview["Error Message"] ||
    globalQuoteData["Error Message"]
  ) {
    console.log("here");
    return <div>No data for this search result</div>;
  }

  if (stockOverviewError || globalQuoteError) {
    return <div>Oops some Error Occured !</div>;
  }

  if (stockOverview?.Note) {
    return (
      <div>
        <p>API limit exhausted</p>
      </div>
    );
  }

  const isDataVisile = !(
    stockOverview?.Note || stockOverview?.["Error Message"]
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
          <LineChartWrapper globalQuoteData={globalQuoteData} />
          <MoreDetails
            globalQuoteData={globalQuoteData}
            stockOverview={stockOverview}
          />
        </>
      )}
    </Card>
  );
}

export default StockDetails;
