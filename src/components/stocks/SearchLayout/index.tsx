import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { fetch } from "../../../api";
import { GET_MATCHING_STOCKS } from "../../../api/constants";
import { useDebounce } from "../../../hooks/useDebounce";
import { Stock, StockSearchResponse } from "./types";
import StocksACHOC from "../../../hocs/AutoCompleteHoc";

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

  return (
    <>
      <section>
        <h1>Stocks Screener</h1>
        <section className="stocks-search">
          <StocksACHOC
            setValue={setInputValue}
            value={inputValue}
            label="Find a Symbol"
            onEnter={(val?: string) => {
              if (val && val.length >= 3) {
                navigate(`/${val}`);
              } else {
                console.log("ad");
                navigate(`/${inputValue}`);
              }
              setInputValue("");
              setStocksList([]);
            }}
            list={stocksList}
          />
        </section>
        <Outlet />
      </section>
    </>
  );
}

export default StocksSearchLayout;
