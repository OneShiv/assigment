import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AutoComplete from "../../AutoComplete";
import { fetch } from "../../../api";
import { GET_MATCHING_STOCKS } from "../../../api/constants";
import { useDebounce } from "../../../hooks/useDebounce";
import { stocksDataTransformer } from "../../../utils";
import { Stock, StockSearchResponse } from "./types";

function StocksSearchLayout() {
  const [inputValue, setInputValue] = useState<string>("");
  const [stocksList, setStocksList] = useState<Stock[]>([]);

  const debouncedInputValue = useDebounce(inputValue, 300);

  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedInputValue.length >= 3) {
      fetch(GET_MATCHING_STOCKS, `&keywords=${debouncedInputValue}`).then(
        (resp: StockSearchResponse) => {
          setStocksList(resp.bestMatches);
        }
      );
    } else {
      setStocksList([]);
    }
  }, [debouncedInputValue]);

  const transformedStocks = stocksDataTransformer(stocksList);

  const onChangeHandler = (newValue: string) => {
    setInputValue(newValue);
  };

  return (
    <>
      <section>
        <h1>Stocks Screener</h1>
        <section className="stocks-search">
          <AutoComplete
            options={transformedStocks}
            onChange={onChangeHandler}
            label="Find a Symbol"
            setSelectedValue={(value) => {
              navigate(`/${value}`);
            }}
          />
        </section>
        <Outlet />
      </section>
    </>
  );
}

export default StocksSearchLayout;
