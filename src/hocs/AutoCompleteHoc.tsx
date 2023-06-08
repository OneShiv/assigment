import { useMemo } from "react";
import { Stock } from "../modules/stocks/SearchLayout/types";
import { stocksDataTransformer } from "../utils";
import AutoComplete from "../components/AutoComplete";

interface HocProps {
  label: string;
  setValue: (val: string) => void;
  onEnter: (val?: string) => void;
  value: string;
  list: Stock[];
}

function StocksAutoCompleteHOC(props: HocProps) {
  const transformedStocks = useMemo(
    () => stocksDataTransformer(props.list),
    [props.list, props.list.length]
  );
  return <AutoComplete {...props} options={transformedStocks} />;
}
export default StocksAutoCompleteHOC;
