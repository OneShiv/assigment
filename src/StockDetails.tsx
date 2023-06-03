import React from "react";
import { useParams } from "react-router-dom";
import { GET_STOCK_INFO, KEY } from "./api/constants";
import { fetch } from "./api";
function StockDetails() {
  const [stockDetails, setStockDetails] = React.useState(null);
  const [stockDetailsFetchError, setStockDetailsFetchError] = React.useState(
    false
  );

  const params = useParams();
  // React.useEffect(() => {
  //   // fetch(`&symbol=${params.id}`).then((response) => console.log(response)).catch(err =>{
  // // setStockDetailsFetchError(true)
  // });
  // }, [params.id]);

  return (
    <section className="stock-details">
      <section></section>
    </section>
  );
}

export default StockDetails;

const displayKeys = ["Name", "Symbol", "Description", "CurrentPrice"];
function LabelPair({ label, value }) {
  return (
    <div class="row">
      <div>{label}</div>
      <div>value</div>
    </div>
  );
}
