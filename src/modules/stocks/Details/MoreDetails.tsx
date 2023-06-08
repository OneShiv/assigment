import LabelValue from "../../../components/common/LabelValue";
import { GlobalQuoteResp, StockOverview } from "./types";

function MoreDetails({
  stockOverview,
  globalQuoteData,
}: {
  stockOverview: StockOverview;
  globalQuoteData: GlobalQuoteResp;
}) {
  let noShow = globalQuoteData && !globalQuoteData["Note"];
  return (
    <>
      <h3>More Details :</h3>
      <section className="stock-details-data">
        <LabelValue
          label="Current Price"
          value={
            noShow ? `$${globalQuoteData["Global Quote"]["05. price"]}` : "-"
          }
        />
        <LabelValue
          label="Change its traded on"
          value={noShow ? globalQuoteData["Global Quote"]["09. change"] : "-"}
        />
        <LabelValue label="Industry" value={stockOverview.Industry} />
        <LabelValue label="PE ratio" value={stockOverview.PERatio} />
        <LabelValue
          label="Market Cap"
          value={stockOverview.MarketCapitalization}
        />
      </section>
    </>
  );
}
export default MoreDetails;
